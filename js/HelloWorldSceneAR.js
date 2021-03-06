'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';

import {
    ViroARScene,
    ViroText,
    ViroConstants,
    ViroMaterials,
    Viro3DObject,
    ViroAmbientLight,
    ViroSpotLight,
    ViroARPlaneSelector,
    ViroAnimations,
} from 'react-viro';

export default class HelloWorldSceneAR extends Component {

    constructor() {
        super();

        // Set initial state here
        this.state = {
            text : "Initializing AR...",
            position: [0,0,0],
            renderMic: false,
        };

        // bind 'this' to functions
        this._onInitialized = this._onInitialized.bind(this);
        this._onDrag = this._onDrag.bind(this);
    }

    _onDrag = (draggedToPosition, source) => {
        this.setState({
            position: [draggedToPosition[0], draggedToPosition[1], draggedToPosition[2]]
        })
    }

    renderMicObj = () => {
        if (this.state.renderMic) {
            return (
                <Viro3DObject
                    source={require('./res/Mic.obj')}
                    resources={[require('./res/Mic.mtl')]}
                    position={[0, -1, 1]}
                    scale={[.5, .5, .5]}
                    type="OBJ" />
            )
        }
        return null
    }

    render() {
        return (
            <ViroARScene onTrackingUpdated={this._onInitialized} >
                <ViroText text={this.state.text} scale={[.5, .5, .5]} position={[0, 0, -1]} style={styles.helloWorldTextStyle} />
                <ViroAmbientLight color={"#aaaaaa"} />
                <ViroSpotLight innerAngle={5} outerAngle={90} direction={[0,-1,-.2]}
                               position={[0, 3, 1]} color="#ffffff" castsShadow={true} />
                <ViroARPlaneSelector minHeight={.5} minWidth={.5} onPlaneSelected={() => this.setState({renderMic: true})}>
                    {this.renderMicObj()}
                </ViroARPlaneSelector>
            </ViroARScene>
        );
    }

    _onInitialized(state, reason) {
        if (state === ViroConstants.TRACKING_NORMAL) {
            this.setState({
                text : "Hello Reverb!"
            });
        } else if (state === ViroConstants.TRACKING_NONE) {
            // Handle loss of tracking
        }
    }
}

var styles = StyleSheet.create({
    helloWorldTextStyle: {
        fontFamily: 'Arial',
        fontSize: 30,
        color: 'red',
        textAlignVertical: 'center',
        textAlign: 'center',
    },
});

ViroMaterials.createMaterials({
    grid: {
        diffuseTexture: require('./res/grid_bg.jpg'),
    },
});

ViroAnimations.registerAnimations({
    rotate: {
        properties: {
            rotateY: "+=90"
        },
        duration: 250, //.25 seconds
    },
});

module.exports = HelloWorldSceneAR;