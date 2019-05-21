import React from "react";
import ReactDOM from "react-dom";
import Evaluation from "./Evaluation";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Evaluation/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
