import React, { Component } from 'react';
import gsap from 'gsap';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ProgressBar from '../../Components/ATOMS/UI - A/ProgressBar/ProgressBar';
import ThreeBg from '../../Components/ORGANISMS/ThreeJsBackground/ThreeJsBackground';
import Navigation from '../../Components/ORGANISMS/Navigation/Navigation';
import AnimatedSwitch from '../AnimatedSwitch/AnimatedSwitch';
import LandscapeWarning from '../../Components/ATOMS/UI - A/LandscapeWarning/LandscapeWarning';
import slides from '../../Components/ORGANISMS/ThreeJsBackground/slides';

import c from './Layout.module.scss';

class Layout extends Component {
  state = {
    curLocation: this.props.location,
    prevLocation: null,
    pageAnimating: false,
    backgroundAnimating: false,
    assetsLoaded: false,
    navZoomComplete: false
  }

  mainRef = React.createRef();
  navOverlayRef = React.createRef();

  componentDidMount() {
    this.mainEl = this.mainRef.current;
  }

  componentDidUpdate(prevProps, prevState) {
    // Targeting the main content of the page
    const childLength = this.mainEl.children.length;
    let visibleChild = this.mainEl.children[childLength-1].children[0];

    // Only runs after initial page load...
    if(visibleChild && this.state.assetsLoaded && !prevState.assetsLoaded) {
      // Zoom-in page effect
      const onPageLoadAnimTl = gsap.timeline();
      onPageLoadAnimTl
        .delay(0.2)
        .set(visibleChild, {z: -250})
        .to(visibleChild, {duration: 1, z: 0, ease: "power2.out"});
    }

    // Selects the main content of the page (not three.js background)
    if(this.visibleChildEl !== visibleChild && visibleChild) {
      this.visibleChildEl = visibleChild;
      this.zoomTl = gsap.timeline({paused: true});
      this.zoomTl.to(this.visibleChildEl, {duration: 0.4, z: -400, ease: "power2.inOut"});
    }

    // Id is either page route name or type name of children
    const prevUniqueId = prevProps.uniqueKey;
    const curUniqueId  = this.props.uniqueKey;

    // If route changes, store prev location for animation
    if(!_.isEqual(prevUniqueId, curUniqueId)) {
      this.setState({
        curLocation: this.props.location,
        prevLocation: prevProps.location,
        pageAnimating: true,
        backgroundAnimating: true
      });

      // Sets the callback function in App.js for when page animation finishes
      this.props.setPageAnimationCallback(this.pageAnimationFinished);
    }

    const { pageAnimating, backgroundAnimating } = this.state;
    const { pageAnimating: prevAnimating, backgroundAnimating: prevBgAnimating } = prevState;

    // If the three.js bg or current page was animating previously, and currently is not, clear state of previous child
    if(!pageAnimating && !backgroundAnimating && (prevAnimating || prevBgAnimating)) {
      this.updateStateToNewChild();
    }

    // If navigation is opened...
    if(this.props.navIsOpen && !prevProps.navIsOpen) {
      this.zoomOut();
    } else if(prevProps.navIsOpen && !this.props.navIsOpen) {
      // Reset navZoomComplete when nav closes
      this.setState({ navZoomComplete: false });

      const leaveAnim = this.props.routeAnim.leave;
      // If the leave animation is in/out AND page hasn't changed, zoom in
      if((leaveAnim === 'leaveIn' || leaveAnim === 'leaveOut') && leaveAnim === prevProps.routeAnim.leave) {
        this.zoomIn();
        // OR if the leave animation isn't either of the two (for performance reasons)
      } else if(leaveAnim !== 'leaveIn' && leaveAnim !== 'leaveOut') {
        this.zoomIn();
      }
    }
  }

  // Sets state to true when images all loaded
  assetsLoadedHandler = () => {
    this.setState({ assetsLoaded: true });
  }

  // Sets page animating state to false
  pageAnimationFinished = () => {
    this.setState({ pageAnimating: false });
  }
  
  // Sets three.js bg animating state to false
  bgAnimationFinishedHandler = () => {
    this.setState({ backgroundAnimating: false });
  }

  // Called when nav zoom out animation completes
  onNavZoomComplete = () => {
    this.setState({ navZoomComplete: true });
  }

  // Callback is ran when page transition fully completes
  updateStateToNewChild = () => {
    this.setState({
      prevLocation: null
    });

    // Resets page transition callback function to null
    this.props.setPageAnimationCallback(null);
  }

  // Zooms out page
  zoomOut = () => {
    if (this.zoomTl) {
      this.zoomTl.progress(0).play();
    }
  }

  // Zooms in page
  zoomIn = () => {
    if (this.zoomTl) {
      this.zoomTl.progress(1).reverse();
    }
  }

  render() {
    const { children } = this.props;
    const { assetsLoaded } = this.state;

    // Let Routes render the current route - animations are handled by individual components
    const content = assetsLoaded ? children : null;
    let landscapeModeWarning = null;

    if(this.state.assetsLoaded) {
      landscapeModeWarning = (
        <LandscapeWarning
          imgSrc={this.props.images['portrait-mode.svg'].src}
          imgAlt="Portrait Mode" />);
    }

    let threeJsBg = null;
    if(slides[this.props.page[0]]) {
      threeJsBg = (
        <ThreeBg
          page={this.props.page}
          routeAnim={this.props.routeAnim}
          animatingProject={this.props.animatingProject}
          scrollAmount={this.props.scrollAmount}
          changeScroll={this.props.changeScroll}
          onAnimationFinished={this.bgAnimationFinishedHandler}
          onNavZoomComplete={this.onNavZoomComplete}
          overlayRef={this.navOverlayRef} />
      );
    }

    return (
      <>
        {landscapeModeWarning}
        <ProgressBar assetsLoaded={this.assetsLoadedHandler} />
        <main ref={this.mainRef} className={c.Layout}>
          <Navigation
            page={this.props.page}
            changeRouteAnim={this.props.changeRouteAnim}
            navZoomComplete={this.state.navZoomComplete} />
          {threeJsBg}
          <div className={c.Layout__Main}>
            {content}
          </div>
          <div ref={this.navOverlayRef} className={c.Layout__NavOverlay}></div>
        </main>
      </>
    );
  }
}

Layout.propTypes = {
  page: PropTypes.arrayOf(PropTypes.string).isRequired,
  routeAnim: PropTypes.shape({
    leave: PropTypes.string,
    appear: PropTypes.string,
  }).isRequired,
  setPageAnimationCallback: PropTypes.func.isRequired,
  changeScroll: PropTypes.func.isRequired,
  changeRouteAnim: PropTypes.func.isRequired,
  animatingProject: PropTypes.shape({
    id: PropTypes.shape({from: PropTypes.number, to: PropTypes.number}),
    anim: PropTypes.shape({from: PropTypes.string, to: PropTypes.string}),
  }),
  scrollAmount: PropTypes.number.isRequired,
  navIsOpen: PropTypes.bool.isRequired,
  images: PropTypes.objectOf(PropTypes.object),
  uniqueKey: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
};

export default AnimatedSwitch(Layout);

 