import React, { useMemo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function DragAndDrop({ sql }) {
  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#486edb',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  };

  const activeStyle = {
    borderColor: '#2196f3',
  };

  const acceptStyle = {
    borderColor: '#00e676',
  };

  const rejectStyle = {
    borderColor: '#ff1744',
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        sql(binaryStr);
      };
      reader.readAsText(file);
    });
  }, [sql]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({ onDrop, accept: '.sql' });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDragActive, isDragReject]
  );

  const files = acceptedFiles.map((file) => (
    <div key={file.path} className='row'>
      <li>
        {file.path} - {file.size} bytes
      </li>
    </div>
  ));

  return (
    <>
      <div className='row'>
        <div className='col-md'>
          <div className='card shadow border-left-primary'>
            <div className='card-body'>
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>
                  Arrastre y suelte un archivo aquí, o haga clic para
                  seleccionar un archivo
                </p>
                <em>Solo se aceptarán archivos * .sql</em>
              </div>
              <aside>
                <br />
                <ul>{files}</ul>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DragAndDrop;
