import React from 'react';
import { Player } from './player';
import { wsc } from './socket-client';
import { EventsType } from './socket-events-types';
import { Thing } from './thing';
import Point from './point';

interface IAppProps {}
interface IAppStats {
  player: Player;
  playersList: Player[];
  thingsList: Thing[];
}

class App extends React.Component<IAppProps, IAppStats> {
  constructor(props) {
    super(props);
    const player = new Player({});
    if (player.getThings().length < 1) {
      player.addThing(
        new Thing({
          user: player.id,
          point: new Point(50,50),
          icon: 'cross',
          color: '#000000',
          isLocale: true,
        })
      );
    }
    this.state = {
      player: player,
      playersList: [player],
      thingsList: player.getThings(),
    };
    wsc.sendRequest(EventsType.USER_CONNECT, player.id, '', { player: player.loadFromStore() });
  }

  private changeUserList = (data) => {
    console.log(data.list);
    let list: Player[] = [this.state.player];
    for (let p in data.list) {
      if (this.state.player.id != data.list[p].id) {
        list.push(new Player(data.list[p]));
        console.log(data.list[p]);
      }
    }
    this.setState({ playersList: list });
  };

  componentDidMount() {
    wsc.on(EventsType.USER_LIST, this.changeUserList);
  }
  componentWillUnmount() {
    wsc.remove(EventsType.USER_LIST, this.changeUserList);
  }
  render(): React.ReactNode {
    const playersList = this.state.playersList.map((p, i) => {
      return <div key={'player-' + i}>{p.render()}</div>;
    });
    const thingsListActive = this.state.thingsList
      .filter((f) => f.isLocale)
      .map((t_props) => {
        const t = new Thing(t_props);
        return <div key={'thing-' + t.id}> {t.render()} </div>;
      });
    const thingsList = this.state.thingsList
      .filter((f) => !f.isLocale)
      .map((t_props) => {
        const t = new Thing(t_props);
        return <div key={'thing-' + t.id}> {t.render()} </div>;
      });
    return (
      <>
        <div className="map">
          <div className="things"> {thingsList} </div>
          <div
            className="things things-player"
            onDragOver={(e) => this.dragOverHandler(e)}
            onDragLeave={(e) => this.dragOverLeave(e)}
            onDragEnter={(e) => this.dragEnter(e)}
            onDrop={(e) => this.onDrop(e)}
          >
            {thingsListActive}
          </div>
        </div>
        <div className="players "> {playersList} </div>
      </>
    );
  }
  dragOverHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    // console.log('dragOverHandler',e)
  }
  onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    const newXY = {
      x: ((e.clientX - rect.x) * 100) / rect.width,
      y: ((e.clientY - rect.y) * 100) / rect.height,
      id: e.dataTransfer.getData('text').split(':')[1],
    };
    const thingsList = [...this.state.thingsList];
    for (let i in thingsList)
      if (newXY.id == this.state.thingsList[i].id) {
        const thing = thingsList[i];
        thing.point = new Point(newXY.x, newXY.y);
        wsc.sendRequest(EventsType.THING_CHANGE, thing.user, thing.id, thing);
      }
    this.setState({ thingsList: thingsList });
    this.state.player.save2Store();
  }
  dragOverLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    // this.setState({isGarland:true})
    // console.log('dragOverLeave',e)
  }
  dragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    // this.setState({isGarland:false})
    // console.log('dragEnter',e)
  }
  // drag(e) {
  // e.dataTransfer.setData('text', e.target.id);
  // this.setState({isGarland:false})
  // console.log('drag',e)
  // }
}

export default App;
