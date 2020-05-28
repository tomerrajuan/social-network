import React from "react";
import axios from "../axios";
import { FriendshipButton } from "../componenets/friendship-button";
import { ProfilePic } from "../componenets/profile-pic";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        axios
            .get("/api/user/" + this.props.match.params.id)
            .then(({ data }) => {
                if (this.props.match.params.id == data.userLoggedIn) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        firstname: data.data.first,
                        lastname: data.data.last,
                        imgUrl: data.data.url,
                        bio: data.data.bio
                    });
                }
            });
    }

    render() {
        return (
            <div className="container">
                <ProfilePic
                    onChange={e => this.handleChange(e)}
                    first={this.state.firstname}
                    last={this.state.lastname}
                    imgUrl={this.state.imgUrl}
                    bio={this.state.bio}
                />
                <FriendshipButton otherId={this.props.match.params.id} />
            </div>
        );
    }
}
