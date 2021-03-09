import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Modal,
  ModalHeader,
  Label,
} from "reactstrap";
import { Link } from "react-router-dom";
import { LocalForm, Control, Errors } from "react-redux-form";
import { postComment } from "./../redux/ActionCreators";
import { Loading } from "./LoadingComponent";
import { baseUrl } from "../shared/baseUrl";
import { FadeTransform, Fade, Stagger } from "react-animation-components";

class CommentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }

  handleSubmit(values) {
    this.toggleModal();
    this.props.postComment(
      this.props.campsiteId,
      values.rating,
      values.author,
      values.text
    );
    console.log("Current state is: " + JSON.stringify(values));
  }
  render() {
    const required = (val) => val && val.length;
    const maxLength = (len) => (val) => !val || val.length <= len;
    const minLength = (len) => (val) => val && val.length >= len;
    return (
      <div>
        <Button outline onClick={this.toggleModal}>
          <i className="fa fa-pencil fa-lg" /> Submit Comment
        </Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
            <div className="form-group">
              <Label htmlFor="rating" md={2}>
                Rating
              </Label>
              <div className="col" md={3}>
                <Control.select
                  model=".rating"
                  className="form-control"
                  name="rating"
                  defaultValue="1"
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Control.select>
              </div>
            </div>
            <div className="form-group">
              <Label htmlFor="author" md={4}>
                Your Name
              </Label>
              <div className="col" md={2}>
                <Control.text
                  model=".author"
                  className="form-control"
                  id="author"
                  name="author"
                  placeholder="Your Name"
                  validators={{
                    required,
                    minLength: minLength(2),
                    maxLength: maxLength(15),
                  }}
                />
                <Errors
                  className="text-danger"
                  model=".author"
                  show="touched"
                  component="div"
                  messages={{
                    required: "Required",
                    minLength: "Must be at least 2 characters",
                    maxLength: "Must be 15 characters or less",
                  }}
                />
              </div>
            </div>
            <div className="form-group">
              <Label htmlFor="text" md={4}>
                Comment
              </Label>
              <div className="col" md={2}>
                <Control.textarea
                  model=".text"
                  className="form-control"
                  id="text"
                  name="text"
                  rows="6"
                />
              </div>
            </div>
            <div className="form-group">
              <div md={{ size: 10, offset: 2 }}>
                <Button type="submit" color="primary">
                  Submit
                </Button>
              </div>
            </div>
          </LocalForm>
        </Modal>
      </div>
    );
  }
}

function RenderComments({ comments, postComment, campsiteId }) {
  return (
    <div className="col-md-5 m-1">
      <h4>Comments</h4>
      <Stagger in>
        {comments.map((comment) => (
          <Fade in key={comment.id}>
            <div>
              <div>
                <div>{comment.text}</div>
                <div>
                  --{comment.author},{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }).format(new Date(Date.parse(comment.date)))}
                </div>
              </div>
            </div>
          </Fade>
        ))}
      </Stagger>
      <CommentForm campsiteId={campsiteId} postComment={postComment} />
    </div>
  );
}

function RenderCampsite({ campsite }) {
  console.log(campsite.name);
  return (
    <div className="col-md-5 m-1">
      <FadeTransform
        in
        transformProps={{
          exitTransform: "scale(0.5) translateY(-50%)",
        }}
      >
        <Card>
          <CardImg src={baseUrl + campsite.image} alt={campsite.name} />
          <CardBody>
            <CardText>{campsite.description}</CardText>
          </CardBody>
        </Card>
      </FadeTransform>
    </div>
  );
}

function CampsiteInfo(props) {
  if (props.isLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  }
  if (props.errMess) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h4>{props.errMess}</h4>
          </div>
        </div>
      </div>
    );
  }
  if (props.campsite) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/directory">Directory</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
            </Breadcrumb>
            <h2>{props.campsite.name}</h2>
            <hr />
          </div>
        </div>
        <div className="row">
          <RenderCampsite campsite={props.campsite} />
          <RenderComments
            comments={props.comments}
            postComment={props.postComment}
            campsiteId={props.campsite.id}
          />
        </div>
      </div>
    );
  }
  return <div />;
}

export default CampsiteInfo;
