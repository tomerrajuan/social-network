import React from "react";
import axios from "../axios";

export class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editingMode: false,
            buttonText: "Edit Bio",
            buttonEdit: "Edit"
        };
    }

    componentDidMount() {
        if (!this.props.bio) {
            this.setState(
                {
                    buttonText: "Edit Bio"
                },
                () => console.log("this state", this.state)
            );
        }
    }

    hanleBio() {
        this.setState({
            editingMode: !this.state.editingMode,
            buttonEdit: "Save"
        });
        this.props.updateBio(this.state.bio);
        this.render();
    }
    bioChange(e) {
        this.setState({
            bio: e.target.value
        });
    }

    editBio() {
        console.log("editBio is running");
        axios.post("/edit-bio", this.state).then(data => {
            this.props.updateBio(data.data.bio);
            this.hanleBio();
        });

    }

// static getDerivedStateFromProps


    render() {
        let buttonText;
        this.props.bio ? buttonText = "Edit Bio" : buttonText = "Add Bio";
        if (this.state.editingMode) {
            return (
                <div>
                    <textarea className="textarea"
                        defaultValue={this.state.bio}
                        onChange={e => this.bioChange(e)}

                    />
                    <div className="button-save">
                        <button className="save" onClick={e => this.editBio(e)}>
                            {" "}
                            Save{" "}
                        </button>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <button className="edit" onClick={e => this.hanleBio(e)}>
                        {" "}
                        {this.state.buttonText}{" "}
                    </button>
                </div>
            );
        }
    }
}
