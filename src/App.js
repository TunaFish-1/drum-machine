import './App.css';
import React from 'react';

const soundSet1 = [
  {name: "Heater-1", url:"https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3", val: "Q"},
  {name: "Heater-2", url:"https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3", val: "W"},
  {name: "Heater-3", url:"https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3", val: "E"},
  {name: "Heater-4", url:"https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3", val: "A"},
  {name: "Clap", url:"https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3", val: "S"},
  {name: "Open-HH", url:"https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3", val: "D"},
  {name: "Kick-n'-Hat", url:"https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3", val: "Z"},
  {name: "Kick", url:"https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3", val: "X"},
  {name: "Closed-HH", url:"https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3", val: "C"}
];

const soundSet2 = [
  {name: "Chord-1", url:"https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3", val: "Q"},
  {name: "Chord-2", url:"https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3", val: "W"},
  {name: "Chord-3", url:"https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3", val: "E"},
  {name: "Shaker", url:"https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3", val: "A"},
  {name: "Open-HH", url:"https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3", val: "S"},
  {name: "Closed-HH", url:"https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3", val: "D"},
  {name: "Punchy-Kick", url:"https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3", val: "Z"},
  {name: "Side-Stick", url:"https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3", val: "X"},
  {name: "Snare", url:"https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3", val: "C"}
];

export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      display: "SoundSet1",
      volume: 0.7,
      muted: false,
      soundSet: false,
      sounds: soundSet1
    };
    this.setDisplay=this.setDisplay.bind(this);
    this.setVolume=this.setVolume.bind(this);
    this.setMute=this.setMute.bind(this);
    this.setSound=this.setSound.bind(this);
  }
  setDisplay(name){
    this.setState({
      display: name, 
      volume: this.state.volume, 
      muted: this.state.muted, 
      soundSet: this.state.soundSet, 
      sounds: this.state.sounds
    });
  }
  setVolume(vol){
    this.setState({
      display: "Volume "+Math.round(vol*100)+"%", 
      volume: vol, 
      muted: this.state.muted, 
      soundSet: this.state.soundSet, 
      sounds: this.state.sounds
    });
  }
  setMute(){
    this.setState({
      display: (this.state.muted?"Unmuted":"Muted"), 
      volume: this.state.volume, 
      muted: !this.state.muted, 
      soundSet: this.state.soundSet, 
      sounds: this.state.sounds
    },()=>{
      document.querySelector(".toggle-mute").classList.toggle("activated");
    });
  }
  setSound(){
    this.setState({
      display: (this.state.soundSet?"SoundSet1":"SoundSet2"), 
      volume: this.state.volume, 
      muted: this.state.muted, 
      soundSet: !this.state.soundSet, 
      sounds: (this.state.soundSet?soundSet1:soundSet2)
    }, () => {
      document.querySelector(".toggle-sounds").classList.toggle("activated");
      let elements = document.getElementsByClassName("clip");
      for (let index = 0; index < this.state.sounds.length; index++) {
        elements[index].src = this.state.sounds[index].url;
      }
    });
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }
  handleKeyPress = (event) => {
    const sound = this.state.sounds.find(item => item.val === event.key.toUpperCase());
    if(!sound) return;
    document.getElementById(sound.val).volume = this.state.volume;
    if(this.state.muted) document.getElementById(sound.val).volume = 0;
    document.getElementById(sound.val).play().catch(console.error);
    document.getElementById("drum-".concat(sound.val)).focus();
    // document.getElementById("display").innerText= sound.name;
    this.setDisplay(sound.name);
  }
  render(){
    return (
      <div className="App" id="drum-machine">
        <div id="display">{this.state.display}</div>
        <div className="drummer">
          {this.state.sounds.map((item, i) => 
            <Drum 
              name={item.name} 
              url={item.url} 
              val={item.val} 
              display={this.setDisplay} 
              vol={this.state.volume} 
              mute={this.state.muted}
              key ={i}
            />
          )}
        </div>
        <div className="controller">
          <input
            className="toggle-volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={this.state.volume}
            onChange={event => {this.setVolume(event.target.valueAsNumber)}}
          />
          <button className="toggle-mute" onClick={this.setMute}>{this.state.muted?"Unmute":"Mute"}</button>
          <button className="toggle-sounds"onClick={this.setSound}>AltSoundSet</button>  
        </div>  
        <p>By Anthony Fakhoury</p>     
      </div>
    );
  }
}

class Drum extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: this.props.name,
      url: this.props.url,
      val: this.props.val
    };
    this.playSound=this.playSound.bind(this);
  }
  playSound(){
    document.getElementById(this.state.val).volume = this.props.vol;
    if(this.props.mute) document.getElementById(this.state.val).volume = 0;
    document.getElementById(this.state.val).play().catch(console.error);
    // document.getElementById("display").innerText= this.state.name;
    this.props.display(this.state.name);
  }  
  render(){
    return (
      <div className="Drum">
        <button className="drum-pad" id={"drum-".concat(this.state.val)} onClick={this.playSound}>
          <audio className="clip" src={this.state.url} id={this.state.val}></audio>
          {this.state.val}
        </button>
      </div>
    );
  }
}