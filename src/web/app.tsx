import { Route, Switch } from "wouter";
import Index from "./pages/index";
import SuccessPage from "./pages/success";
import CosmoPage from "./pages/cosmo";
import { Provider } from "./components/provider";

function App() {
        return (
                <Provider>
                        <Switch>
                                <Route path="/" component={Index} />
                                <Route path="/success" component={SuccessPage} />
                                <Route path="/cosmo" component={CosmoPage} />
                        </Switch>
                </Provider>
        );
}

export default App;
