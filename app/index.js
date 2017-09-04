/** @jsx h */

import component from './component';
import 'purecss';
import 'font-awesome/css/font-awesome.css';
import { bake } from './shake';
import { h, render } from 'preact';

bake();

document.body.appendChild(component());

const helloComponent = <div onClick={() => alert('hello')}>Hello world</div>;
render(helloComponent, document.body);
