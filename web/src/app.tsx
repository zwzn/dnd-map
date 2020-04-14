import { render, h } from 'preact'
import { Router, Route } from 'preact-router'
import { Home } from './pages/home'
import { Game } from './pages/game'
import { ModalController } from './components/modal'
import './app.scss'

const root = document.getElementById('app')

if (!root) {
    throw new Error("the #app element is not found")
}

render(<div>
    <Router>
        <Route path='/' component={Home} />
        <Route path='/game/:dm/:id' component={Game} />
    </Router>
    <ModalController />
</div>, root)
