import React from 'react';
// import {
//   Icon,
// } from '@blueprintjs/core';
import { v4 as uuid } from 'uuid';
// import {wsc} from './socket-client'
// import {EventsType} from './socket-events-types'
import Point from './point';
import './css/thing.scss';

interface IThing {
  id?: string;
  point: Point;
  user?: string | null;
  icon: string;
  color: string;
}
interface IThingProps extends IThing {
  isLocale: boolean;
}
interface IThingStats extends IThingProps {
  isDrag: boolean;
}

class Thing extends React.Component<IThingProps, IThingStats> {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id || uuid(),
      user: props.user || null,
      point: props.point || new Point(),
      icon: props.icon || 'cross',
      color: props.color || '#ff0000',
      isLocale: props.isLocale || false,
      isDrag: false,
    };
  }
  get id() {
    return this.state.id;
  }
  get user() {
    return this.state.user;
  }
  get point() {
    return this.state.point;
  }
  set point(p:Point) {
    console.log('>>>>>',p)
    this.setState({point:p})
  }
  get isLocale() {
    return this.state.isLocale;
  }
  public toJSON() {
    return {
      id: this.state.id || uuid(),
      user: this.state.user || null,
      point: this.state.point || new Point(),
      icon: this.state.icon || 'cross',
      color: this.state.color || '#ff0000',
      isLocale: this.state.isLocale || false,
    };
  }
  drag(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
    this.setState({ isDrag: true });
  }
  dragEnd() {
    this.setState({ isDrag: false });
  }
  render(): React.ReactNode {
    const classes = ['thing-cover'];
    if (this.state.isLocale) classes.push('islocale');
    const position = {
      top: `calc(${this.state.point.y}% - var(--thing-size) / 2)`,
      left: `calc(${this.state.point.x}% - var(--thing-size) / 2)`,
      opacity: this.state.isDrag ? 0.1 : 1,
    };
    // console.log('>>>>>', this.state.isDrag);
    return (
      <div key={'thing-' + this.state.id} className={classes.join(' ')}>
        <div
          id={'thing:' + this.state.id}
          draggable={this.state.isLocale}
          onDragStart={(e) => this.drag(e)}
          onDragEnd={() => this.dragEnd()}
          className={'thing thing-' + this.state.id}
          style={{ ...position }}
        >
          X
        </div>
      </div>
    );
  }
}

export { Thing, IThing };
