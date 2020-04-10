import { render, h } from 'preact'
import { Router, Route } from 'preact-router'
import { Home } from './pages/home'
import { Game } from './pages/game'

render(<Router>
    <Route path='/' component={Home} />
    <Route path='/game/:id' component={Game} />
</Router>, document.getElementById('app')!)