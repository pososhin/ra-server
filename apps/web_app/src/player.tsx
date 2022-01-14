import React from 'react';
import { v4 as uuid } from 'uuid';
import { IPlayer } from './iplayer';
import { wsc } from './socket-client';
import { EventsType } from './socket-events-types';
import { Thing } from './thing';

const SESSION_USER = 'ret_alert_session_user';

interface IPlayerProps extends IPlayer {
  isLocale: boolean;
}
interface IPlayerStats {}

class Player extends React.Component<IPlayerProps, IPlayerStats> {
  public id: string;
  public name: string = '';
  public isLocale: boolean = false;
  public thingsList: Thing[] ;

  constructor(props) {
    super(props);
    if (!props.id) {
      const obj:IPlayerProps = this.loadFromStore();
      this.id = !obj || !obj.id ? uuid() : obj.id;
      this.isLocale = true;
      this.name = obj.name || props.name || '';
      this.thingsList = obj.thingsList || [];
      this.save2Store();
    } else {
      this.id = props.id;
      this.name = props.name;
      this.isLocale = false;
      this.thingsList = props.thingsList || [];
    }    
  }
  addThing(thing: Thing) {
    this.thingsList.push(thing);
    this.save2Store();
  }
  getThings(){ return this.thingsList}

  loadFromStore(): IPlayerProps {
    const str = sessionStorage.getItem(SESSION_USER);
    if (str) {      
      return JSON.parse(str);
    }
    return { isLocale: true };
  }
  save2Store() {
    if (!this.isLocale) return;

    const obj: IPlayerProps = {
      id: this.id,
      name: this.name,
      isLocale: true,
      thingsList: this.thingsList,
    };
    sessionStorage.setItem(SESSION_USER, JSON.stringify(obj));
  }
  private handleNameChange = (e) => {
    // console.log('value', e.target.value);
    this.name = e.target.value;
    this.save2Store();
    wsc.sendRequest(EventsType.USER_CHANGE, this.id, this.id, this.loadFromStore());
  };
  render(): React.ReactNode {
    const classes = ['player'];
    if (this.isLocale) classes.push('islocale');
    if (!this.isLocale) {
      return (
        <div className={classes.join(' ')}>
          <div className="player-name">{this.name ? this.name : 'noname'}</div>
          <div className="player-id">{this.id}</div>
        </div>
      );
    } else {
      return (
        <div className={classes.join(' ')}>
          {/* <InputGroup
            placeholder="NONAME"
            defaultValue={this.name}
            onChange={this.handleNameChange}
          /> */}
          <input type="text"
            placeholder="NONAME"
            defaultValue={this.name}
            onChange={this.handleNameChange}
           />
          {/* <div className="player-name">{this.name ? this.name : '---noname'}</div> */}
          <div className="player-id">{this.id}</div>
        </div>
      );
    }
  }
}

export { Player };
