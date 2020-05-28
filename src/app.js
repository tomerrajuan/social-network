import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import axios from "./axios";
import { Chat } from "./componenets/chat";
import { Header } from "./componenets/headers";
import Navbar from "./componenets/navbar";
import { Profile } from "./componenets/profile";
import { SearchUsers } from "./componenets/search-user";
import Uploader from "./componenets/uploader";
import NewFriends from "./containers/friends";
import OtherProfile from "./containers/other-profile";

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        axios.get("/user.json").then(({ data }) => {
            console.log("data in return user data is ", data);
            this.setState({
                firstname: data.data.first,
                lastname: data.data.last,
                imgUrl: data.data.url,
                bio: data.data.bio
            });
        });
    }

    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    }

    changeImage(imageUrl) {
        this.setState({
            imgUrl: imageUrl
        });
    }

    updateBio(bio) {
        this.setState({
            bio: bio
        });
    }

    render() {
        return (
            <div className="app">
                <BrowserRouter>
                    <Header imgUrl={this.state.imgUrl} />
                    <Navbar />

                    <div>
                        {this.state.uploaderIsVisible && (
                            <Uploader changeImage={this.changeImage} />
                        )}
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    imgUrl={this.state.imgUrl}
                                    bio={this.state.bio}
                                    updateBio={this.updateBio}
                                    toggle={this.toggleModal}
                                />
                            )}
                        />
                        <Route path="/friends" component={NewFriends}/>
                        <Route path="/search-user/" component={SearchUsers} />
                        <Route path="/user/:id" component={OtherProfile} />
                        <Route path="/chat" component={Chat} />

                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
