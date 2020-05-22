import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import closeRed from '../assets/images/icons/close-red.png';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};


export default function Dropzone(props) {
  const {handleNewFile, images, onRemoveImage} = props;
  const [files, setFiles] = useState([]);
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      handleNewFile(acceptedFiles);
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    },
  });

  const thumbs = images.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <div className={'remove'} onClick={() => {onRemoveImage(file)}}>
          <img src={closeRed} alt=""/>
        </div>
        <img
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  useEffect(() => () => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Arrastra las imagenes o haz click aquí para seleccionar</p>
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
    </section>
  );
}
