import { Outlet } from "react-router-dom";
import { Page } from "@geist-ui/core";
import { ENV } from "./utils/config";

function App() {
  console.log(ENV);

  return (
    <Page>
      <Page.Header>
        <h2>头部</h2>
      </Page.Header>
      <Page.Content>
        <Outlet />
      </Page.Content>
      <Page.Footer>
        <h2>尾部</h2>
      </Page.Footer>
    </Page>
  );
}

export default App;
