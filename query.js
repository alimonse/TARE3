const ANOMALY_QUERY = `
DECLARE @esquemas TABLE (nombre_esquemas varchar(255));
INSERT INTO @esquemas
SELECT DISTINCT TABLE_SCHEMA FROM INFORMATION_SCHEMA.TABLES
DECLARE @count INT = 0;
DECLARE @i INT = 0;
SELECT @count=  Count(*) FROM @esquemas
DECLARE @value VARCHAR(50)
DECLARE db_cursor CURSOR FOR  
SELECT * FROM @esquemas
OPEN db_cursor   
FETCH NEXT FROM db_cursor INTO @value   
WHILE @@FETCH_STATUS = 0  
BEGIN
	DECLARE @value2 VARCHAR(50)
	DECLARE db_cursor2 CURSOR FOR  
	SELECT 
	fk.name AS foreign_key_name
	FROM sys.foreign_key_columns fkc
	INNER JOIN sys.foreign_keys fk ON fk.object_id = fkc.constraint_object_id
	INNER JOIN sys.tables p ON p.object_id = fkc.parent_object_id 
	INNER JOIN sys.schemas sp ON sp.schema_id = p.schema_id
	WHERE sp.name = @value
	OPEN db_cursor2 
	FETCH NEXT FROM db_cursor2 INTO @value2 
	WHILE @@FETCH_STATUS = 0  
	BEGIN
		DECLARE @dbcc_tabla TABLE (NOMBRE_TABLA varchar(max), NOMBRE_CONSTRAINT varchar(max), ANOMALIA varchar(max), ESQUEMA varchar(max));
		INSERT INTO @dbcc_tabla (NOMBRE_TABLA, NOMBRE_CONSTRAINT, ANOMALIA)
		EXEC ('DBCC CHECKCONSTRAINTS('''+ @value+'.'+@value2 +''')') 
		UPDATE @dbcc_tabla SET ESQUEMA=@value
		FETCH NEXT FROM db_cursor2 INTO @value2  
	END
	CLOSE db_cursor2   
    DEALLOCATE db_cursor2
	DECLARE @tablas varchar(max)
	DECLARE tablas_cursor CURSOR FOR  
	SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
	WHERE TABLE_TYPE='BASE TABLE' AND TABLE_SCHEMA=@value
	OPEN tablas_cursor   
	FETCH NEXT FROM tablas_cursor INTO @tablas
	WHILE @@FETCH_STATUS = 0  
	BEGIN
		DECLARE @tablas2 varchar(max)
		DECLARE tablas_cursor2 CURSOR FOR  
		SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
		WHERE TABLE_TYPE='BASE TABLE' AND TABLE_SCHEMA=@value
		OPEN tablas_cursor2
		FETCH NEXT FROM tablas_cursor2 INTO @tablas2
		WHILE @@FETCH_STATUS = 0  
		BEGIN
			IF(@tablas != @tablas2)
			BEGIN
				DECLARE @res TABLE (COLUMN_NAME varchar(max));
				INSERT INTO @res
				SELECT COLUMN_NAME FROM [INFORMATION_SCHEMA].[COLUMNS] SC1
				WHERE SC1.TABLE_NAME=@tablas
				INTERSECT
				SELECT COLUMN_NAME FROM [INFORMATION_SCHEMA].[COLUMNS] SC2
				WHERE SC2.TABLE_NAME=@tablas2
				DECLARE @constraints_tabla TABLE (TABLA_UNO varchar(max), TABLA_DOS varchar(max), POSIBLE_RELACION varchar(max), ESQUEMA varchar(max));
				IF (SELECT COUNT(COLUMN_NAME) FROM @res)<>0
				BEGIN
					DECLARE @colrelacion varchar(255);
					SELECT @colrelacion=COLUMN_NAME FROM @res;
					INSERT INTO @constraints_tabla (TABLA_UNO, TABLA_DOS, POSIBLE_RELACION, ESQUEMA) VALUES (@tablas, @tablas2, @colrelacion, @value)
				END
				DELETE FROM @res
				
			END
			FETCH NEXT FROM tablas_cursor2 INTO @tablas2  
		END
		CLOSE tablas_cursor2   
		DEALLOCATE tablas_cursor2
		FETCH NEXT FROM tablas_cursor INTO @tablas   
	END
	IF (SELECT COUNT(*) FROM @dbcc_tabla)<>0
	BEGIN
		SELECT * FROM @dbcc_tabla
	END
	IF (SELECT COUNT(*) FROM @constraints_tabla)<>0
	BEGIN
		SELECT * FROM @constraints_tabla
	END
	
	DELETE FROM @constraints_tabla
	DELETE FROM @dbcc_tabla

	CLOSE tablas_cursor   
	DEALLOCATE tablas_cursor
    FETCH NEXT FROM db_cursor INTO @value   
END
CLOSE db_cursor   
DEALLOCATE db_cursor`;
const GET_ALLDB_QUERY = `SELECT name FROM master.dbo.sysdatabases`;
const ANOMALY_TRIGGERS_QUERY = `
declare @Tabla varchar(max);
declare @column varchar(max);
declare @parentTable varchar(max);

declare TablaSuelta CURSOR FOR (SELECT tbl.name 
FROM sys.tables AS tbl
    LEFT JOIN sys.foreign_key_columns AS fKey 
        ON tbl.object_id = fKey.parent_object_id
    LEFT JOIN sys.foreign_key_columns AS rKey 
        ON tbl.object_id = rKey.referenced_object_id
WHERE fKey.parent_object_id IS NULL 
    AND rKey.referenced_object_id IS NULL
	And tbl.name != 'sysdiagrams')

open TablaSuelta

fetch next from TablaSuelta into @Tabla
while @@FETCH_STATUS = 0
begin
set @column = (select Col.COLUMN_NAME from INFORMATION_SCHEMA.TABLE_CONSTRAINTS Tab, INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE Col WHERE Col.Constraint_Name = Tab.Constraint_Name AND Col.Table_Name = Tab.Table_Name AND Constraint_Type = 'PRIMARY KEY'	and Col.TABLE_NAME = @Tabla)


set @parentTable =(SELECT Tab.TABLE_NAME from 
    INFORMATION_SCHEMA.TABLE_CONSTRAINTS Tab, 
    INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE Col 
WHERE 
    Col.Constraint_Name = Tab.Constraint_Name
    AND Col.Table_Name = Tab.Table_Name
    AND Constraint_Type = 'PRIMARY KEY'
	and Col.COLUMN_NAME = @column
	and Col.TABLE_NAME != @Tabla);
	PRINT @Tabla

IF (@Tabla IS NULL OR @column IS NULL OR @parentTable IS NULL)
	PRINT 'No hay anomalías de datos detectables'
ELSE
	EXECUTE('SELECT * FROM [' + @Tabla + '] WHERE  NOT EXISTS (SELECT * 
                    FROM  ['+@parentTable+']
				    WHERE ['+@Tabla+'].['+@column+'] = ['+@parentTable+'].['+@column+'])')
	DECLARE @dbcc_tabla TABLE (NOMBRE_TABLA varchar(max));
	INSERT INTO @dbcc_tabla (NOMBRE_TABLA) VALUES (@Tabla)
fetch next from TablaSuelta into @Tabla
END
deallocate TablaSuelta
SELECT * FROM @dbcc_tabla 
`;

const TABLAS_SIN_RELACIONES = `SELECT S.NAME + N'.' + T.NAME AS TABLAS_SIN_RELACIONES
FROM SYS.TABLES AS T
INNER JOIN SYS.SCHEMAS AS S
ON T.[SCHEMA_ID] = S.[SCHEMA_ID]
WHERE NOT EXISTS
(
    SELECT 1 FROM SYS.FOREIGN_KEYS AS FK
			WHERE FK.REFERENCED_OBJECT_ID = T.[OBJECT_ID]
) AND NOT EXISTS
(
    SELECT 1 FROM SYS.FOREIGN_KEYS AS FK
			WHERE FK.PARENT_OBJECT_ID = T.[OBJECT_ID]
);
`;

const ANOMALY_CUD_QUERY = `
declare @Tabla varchar(max);
                            declare TablaSuelta CURSOR FOR (SELECT tbl.name 
                            FROM sys.tables AS tbl
                                LEFT JOIN sys.foreign_key_columns AS fKey 
                                    ON tbl.object_id = fKey.parent_object_id
                                LEFT JOIN sys.foreign_key_columns AS rKey 
                                    ON tbl.object_id = rKey.referenced_object_id
                            WHERE fKey.parent_object_id IS NULL 
                                AND rKey.referenced_object_id IS NULL
	                            And tbl.name != 'sysdiagrams')

                            open TablaSuelta

                            fetch next from TablaSuelta into @Tabla
                            while @@FETCH_STATUS = 0
                            begin
                            declare @Aux varchar(max) = (SELECT MAX(NAME) FROM sys.objects WHERE type = 'TR' and  OBJECT_NAME(parent_object_id) =@Tabla);

							IF(@Aux is not null)
                                EXECUTE('SELECT  table_name = OBJECT_NAME(parent_object_id) ,
                                        trigger_name = name ,
                                        trigger_owner = USER_NAME(schema_id) ,
                                        OBJECTPROPERTY(object_id, ''ExecIsUpdateTrigger'') AS isupdate ,
                                        OBJECTPROPERTY(object_id, ''ExecIsDeleteTrigger'') AS isdelete ,
                                        OBJECTPROPERTY(object_id, ''ExecIsInsertTrigger'') AS isinsert ,
                                        OBJECTPROPERTY(object_id, ''ExecIsAfterTrigger'') AS isafter ,
                                        OBJECTPROPERTY(object_id, ''ExecIsInsteadOfTrigger'') AS isinsteadof ,
                                        CASE OBJECTPROPERTY(object_id, ''ExecIsTriggerDisabled'')
                                          WHEN 1 THEN ''Disabled''
                                          ELSE ''Enabled''
                                        END AS status,
		                                CASE WHEN 
			                                OBJECTPROPERTY(object_id, ''ExecIsInsertTrigger'') = 1 and 
			                                OBJECTPROPERTY(object_id, ''ExecIsDeleteTrigger'') = 1 and
			                                OBJECTPROPERTY(object_id, ''ExecIsUpdateTrigger'') = 1
			                                THEN ''sin anomalia''
			                                ELSE ''con anomalia''
		                                END AS tiene_anomalia
                                FROM    sys.objects
                                WHERE   type = ''TR'' and  OBJECT_NAME(parent_object_id) = '''+@Tabla+'''
                                ORDER BY OBJECT_NAME(parent_object_id)')
                                fetch next from TablaSuelta into @Tabla

                            END
							deallocate TablaSuelta`;

exports.ANOMALY_QUERY = ANOMALY_QUERY;
exports.GET_ALLDB_QUERY = GET_ALLDB_QUERY;
exports.ANOMALY_TRIGGERS_QUERY = ANOMALY_TRIGGERS_QUERY;
exports.TABLAS_SIN_RELACIONES = TABLAS_SIN_RELACIONES;
exports.ANOMALY_CUD_QUERY = ANOMALY_CUD_QUERY;
exports.TABLAS_SIN_RELACIONES = TABLAS_SIN_RELACIONES;
