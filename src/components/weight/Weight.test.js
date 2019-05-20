import React from "react";
import ReactDOM from "react-dom";
import Weight from "./Weight";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Weight/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
