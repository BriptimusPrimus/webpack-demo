import component from './component';
import 'purecss';
import 'font-awesome/css/font-awesome.css';
import 'react';
import { bake } from './shake';

bake();

document.body.appendChild(component());
