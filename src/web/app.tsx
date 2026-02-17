import { Route, Switch } from "wouter";
import Index from "./pages/index";
import SuccessPage from "./pages/success";
import { Provider } from "./components/provider";

function App() {
	return (
		<Provider>
			<Switch>
				<Route path="/" component={Index} />
				<Route path="/success" component={SuccessPage} />
			</Switch>
		</Provider>
	);
}

export default App;
