import React from "react";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    render() {
        return (
            <div className="head">

                <a href="/welcome">
                    <img className="header-img" src={this.props.imgUrl} />
                </a>
                <a href="/welcome">
                    <img id="logo" src="/logo.png" alt="logo" />
                </a>
            </div>
        );
    }
}
