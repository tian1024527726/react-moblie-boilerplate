import createHashHistory from 'history/lib/createHashHistory';
import createBrowserHistory from 'history/lib/createBrowserHistory';

let history = null;
if (process.env.ROUTE_MODE === 'hash') {
	history = createHashHistory();
} else if (process.env.ROUTE_MODE === 'browser') {
	history = createBrowserHistory();
} else {
	history = createHashHistory();
}

module.exports = history;
