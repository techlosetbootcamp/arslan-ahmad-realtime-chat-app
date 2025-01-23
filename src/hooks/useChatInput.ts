const appChat = () => {
  const handleCamera = () => {
    console.log('Camera button pressed');
  };

  const handleSelectImages = () => {
    console.log('Select images button pressed');
  };
  return {handleCamera, handleSelectImages};
};
export default appChat;
