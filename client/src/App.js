import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  state = {
    selectedFile: null,
    progress: 0,
    resMessage: ""
  };

  onFileSelect = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  };

  onFileUpload = () => {
    if (!this.state.selectedFile) return;
    const fd = new FormData();
    fd.append("image", this.state.selectedFile, this.state.selectedFile.name);
    axios
      .post(
        "https://us-central1-react-fb-upload.cloudfunctions.net/onUpload",
        fd,
        {
          onUploadProgress: ProgressEvent => {
            this.setState({
              progress: Math.round(
                ProgressEvent.loaded / ProgressEvent.total * 100
              )
            });
            console.log(
              `upload progress:${Math.round(
                ProgressEvent.loaded / ProgressEvent.total * 100
              )}%`
            );
          }
        }
      )
      .then(res => {
        console.log(res);
        this.setState({ resMessage: res.data.message });
      })
      .catch(err => console.error(err));
  };

  render() {
    return (
      <div className="App">
        <input type="file" onChange={this.onFileSelect} />
        <button onClick={this.onFileUpload}>Upload</button>
        <progress value={this.state.progress} max="100">
          {this.state.progress}%
        </progress>
        <p>{this.state.resMessage}</p>
      </div>
    );
  }
}

export default App;
