/* Assignment 4: So You Think Ants Can Dance
 * CSCI 4611, Spring 2023, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { Skeleton } from './Skeleton'
import { MotionClip } from './MotionClip'
import { Pose } from './Pose';
import { Bone } from './Bone';

export class AnimatedCharacter extends gfx.Transform3
{
    public skeleton: Skeleton;
    public fps: number;
    public useAbsolutePosition: boolean;
    
    private clip: MotionClip | null;
    
    private currentTime: number;
    private currentPose: Pose;
    
    private overlayQueue: MotionClip[];
    private overlayTransitionFrames: number[];
    private overlayTime: number;
    private overlayPose: Pose;

    constructor(fps = 60, useAbsolutePosition = true)
    {
        super();
        
        // Create skeleton and add it as a child
        this.skeleton = new Skeleton();
        this.add(this.skeleton);

        this.fps = fps;
        this.useAbsolutePosition = useAbsolutePosition;

        this.clip = null;

        this.currentTime = 0;
        this.currentPose = new Pose();
        
        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;  
        this.overlayPose = new Pose();
    }

    // Entry function for the recursive call
    createMeshes(): void
    {
        // Drawing the coordinate axes is a good way to check your work.
        // To start, this will just create the axes for the root node of the
        // character, but once you add this to createMeshesRecursive, you 
        // can draw the axes for each bone.  The visibility of the axes
        // is toggled using a checkbox.
        const axes = new gfx.Axes3(0.15);
        this.skeleton.add(axes);

        // Call the recursive method for each root bone
        this.skeleton.children.forEach((child: gfx.Transform3) => {
            if(child instanceof Bone)
                this.createMeshesRecursive(child);
        });
    }


    private createMeshesRecursive(bone: Bone): void
    {

        

        // TO DO (PART 1): Draw the coordinate axes for the bone
        // const axes = new gfx.Axes3(1);
        // axes.lookAt(bone.direction);
        // axes.translateZ(-bone.length);
        // this.add(axes);

        const axes = new gfx.Axes3(0.15);
        axes.lookAt(bone.direction);
        // axes.translateZ(-bone.length);
        bone.add(axes);

        // TO DO (PART 3): You will want to draw something different for each
        // part of the body. An if statement like this is an easy way
        // to do that.  You can find the names of additional bones in 
        // the .asf files.  Anything that you create will be automatically
        // be made invisible when the coordinate axes are visibile.
        // if(bone.name == 'head')
        // {
        // }
        // else if(bone.name == 'upperback')
        // {
        // }
        const black = new gfx.Color(0,0,0);
        const antColor = new gfx.Color(0.7, 0.2, 0.1)
        if (bone.name == 'head') 
        {
            const headBone = new gfx.SphereMesh();
            headBone.scale.multiply(new gfx.Vector3(0.1, 0.1, 0.2))
            headBone.material.setColor(antColor);
            headBone.translateY(0.1);
            headBone.rotateX(45)
            bone.add(headBone);

            const reye = new gfx.SphereMesh(0.03, 0.03);
            reye.translate(new gfx.Vector3(0.05, 0.2, 0));
            reye.material.setColor(new gfx.Color(0, 0, 0));
            bone.add(reye);

            const leye = new gfx.SphereMesh(0.03, 0.03);
            leye.translate(new gfx.Vector3(-0.05, 0.2, 0));
            leye.material.setColor(new gfx.Color(0, 0, 0));
            bone.add(leye);

            const lantenna = new gfx.BoxMesh(0.01, 0.25, 0.01);
            lantenna.material.setColor(new gfx.Color(0, 0, 0));
            lantenna.translate(new gfx.Vector3(0.05, 0.3, -0.05));
            bone.add(lantenna);

            const rantenna = new gfx.BoxMesh(0.01, 0.25, 0.01);
            rantenna.material.setColor(new gfx.Color(0, 0, 0));
            rantenna.translate(new gfx.Vector3(-0.05, 0.3, -0.05));
            bone.add(rantenna);

            const lantennatip = new gfx.ConeMesh(0.02, 0.1);
            lantennatip.material.setColor(black);
            lantennatip.translate(new gfx.Vector3(0.05, 0.4, -0.01));
            lantennatip.rotateX(90);
            bone.add(lantennatip);

            const rantennatip = new gfx.ConeMesh(0.02, 0.1);
            rantennatip.material.setColor(black);
            rantennatip.translate(new gfx.Vector3(-0.05, 0.4, -0.01));
            rantennatip.rotateX(90);
            bone.add(rantennatip);

            const lmandible = new gfx.SphereMesh(0.03, 0.03);
            lmandible.material.setColor(new gfx.Color(0.7, 0.2, 0.1));
            lmandible.translateY(-0.07);
            lmandible.translateZ(0.1);
            lmandible.translateX(-0.01);
            bone.add(lmandible);

            const rmandible = new gfx.SphereMesh(0.03, 0.03);
            rmandible.material.setColor(new gfx.Color(0.7, 0.2, 0.1));
            rmandible.translateY(-0.07);
            rmandible.translateZ(0.1);
            rmandible.translateX(0.01);
            bone.add(rmandible);
        }
        else if (bone.name == 'upperneck')
        {
            const upperneck = new gfx.BoxMesh(0.025, 0.2, 0.025);
            upperneck.translateY(0.02);
            upperneck.material.setColor(new gfx.Color(0, 0, 0));
            bone.add(upperneck);
        }
        else if (bone.name == 'lowerneck')
        {
            const lowerneck = new gfx.BoxMesh(0.025, 0.1, 0.025);
            lowerneck.material.setColor(new gfx.Color(0, 0, 0));
            bone.add(lowerneck);
        }
        else if (bone.name == 'lclavicle')
        {
            const lclavicle = new gfx.SphereMesh(0.1, 0.1);
            lclavicle.material.setColor(antColor);
            bone.add(lclavicle);
        }
        else if (bone.name == 'rclavicle')
        {
            const rclavicle = new gfx.SphereMesh(0.1, 0.1);
            rclavicle.material.setColor(antColor);
            bone.add(rclavicle);
        }
        // chest area 
        else if (bone.name == 'thorax')
        {
            const thorax = new gfx.SphereMesh();
            thorax.scale.multiply(new gfx.Vector3(0.25, 0.15, 0.1));
            thorax.material.setColor(antColor);
            bone.add(thorax);
        }
        else if (bone.name == 'upperback')
        {
            const upperback = new gfx.SphereMesh();
            upperback.scale.multiply(new gfx.Vector3(0.15, 0.15, 0.1));
            upperback.material.setColor(antColor);
            bone.add(upperback)
        }
        else if (bone.name == 'lowerback')
        {
            const lowerback = new gfx.SphereMesh();
            lowerback.scale.multiply(new gfx.Vector3(0.15, 0.15, 0.1));
            lowerback.material.setColor(antColor);
            bone.add(lowerback)
        }
        // arms and hands
        else if (bone.name == 'lhumerus')
        {
            const lhumerus = new gfx.BoxMesh(bone.length, 0.02, 0.02);
            lhumerus.translate(new gfx.Vector3(-0.1, 0, 0.01));
            lhumerus.material.setColor(black);
            bone.add(lhumerus);
        }
        else if (bone.name == 'rhumerus')
        {
            const rhumerus = new gfx.BoxMesh(bone.length, 0.02, 0.02);
            rhumerus.translate(new gfx.Vector3(0.1, 0, 0.01));
            rhumerus.material.setColor(black);
            bone.add(rhumerus);
        }
        else if (bone.name == 'lradius')
        {
            const lradius = new gfx.BoxMesh(0.28, 0.02, 0.02);
            lradius.material.setColor(black);
            bone.add(lradius);
        }
        else if (bone.name == 'rradius')
        {
            const rradius = new gfx.BoxMesh(0.28, 0.02, 0.02);
            rradius.material.setColor(black);
            bone.add(rradius);
        }
        else if (bone.name == 'lfingers')
        {
            const lfingers = new gfx.SphereMesh(0.03, 0.03);
            lfingers.translate(new gfx.Vector3(0.01, 0, 0.01));
            lfingers.material.setColor(black);
            bone.add(lfingers);
        }
        else if (bone.name == 'rfingers')
        {
            const rfingers = new gfx.SphereMesh(0.03, 0.03);
            rfingers.translate(new gfx.Vector3(0.01, 0, -0.01));
            rfingers.material.setColor(black);
            bone.add(rfingers);
        }
        else if (bone.name == 'lthumb')
        {
            const lthumb = new gfx.BoxMesh(0.05, 0.03, 0.03);
            lthumb.material.setColor(black);
            lthumb.translateX(0.04);
            lthumb.translateZ(0.03);
            bone.add(lthumb);
        }
        else if (bone.name == 'rthumb')
        {
            const rthumb = new gfx.BoxMesh(0.05, 0.03, 0.03);
            rthumb.material.setColor(black);
            rthumb.translateX(-0.04);
            rthumb.translateZ(-0.03);
            bone.add(rthumb)
        }

        // legs
        else if (bone.name == 'lfemur')
        {
            const lfemur = new gfx.BoxMesh(0.02, bone.length, 0.02);
            lfemur.material.setColor(black);
            lfemur.translate(new gfx.Vector3(-0.1, 0.3, 0));
            lfemur.rotateZ(0.6);
            bone.add(lfemur);
        }
        else if (bone.name == 'rfemur')
        {
            const rfemur = new gfx.BoxMesh(0.02, bone.length*1.25, 0.02);
            rfemur.material.setColor(black);
            rfemur.translate(new gfx.Vector3(0.1, 0.3, 0));
            rfemur.rotateZ(-0.6);
            bone.add(rfemur);
        }
        else if (bone.name == 'ltibia')
        {
            const ltibia = new gfx.BoxMesh(0.02, bone.length, 0.02);
            ltibia.material.setColor(black);
            ltibia.rotate(new gfx.Vector3(-0.7, 0, 0.3));
            ltibia.translate(new gfx.Vector3(0, 0.2, 0.1));
            bone.add(ltibia);
        }
        else if (bone.name == 'rtibia')
        {
            const rtibia = new gfx.BoxMesh(0.02, bone.length*1.25, 0.02);
            rtibia.material.setColor(black);
            rtibia.rotate(new gfx.Vector3(-0.7, 0, 0));
            rtibia.translate(new gfx.Vector3(0, 0.2, 0.1));
            bone.add(rtibia);
        }
        else if (bone.name == 'lfoot')
        {
            const lfoot = new gfx.BoxMesh(0.05, 0.05, 0.1);
            lfoot.rotateX(0.1);
            lfoot.material.setColor(black);
            bone.add(lfoot);
        }
        else if (bone.name == 'rfoot')
        {
            const lfoot = new gfx.BoxMesh(0.05, 0.05, 0.1);
            lfoot.material.setColor(black);
            bone.add(lfoot);
        }
        // TO DO (PART 1): Recursively call this function for each of the bone's children
        bone.children.forEach((childBone: gfx.Transform3) => {
            if (childBone instanceof Bone)
                this.createMeshesRecursive(childBone);
        });
    }

    // You do not need to modify any code below this comment to complete the base assignment.

    loadSkeleton(filename: string): void
    {
        this.skeleton.loadFromASF(filename);
    }

    loadMotionClip(filename: string): MotionClip
    {
        const clip = new MotionClip();
        clip.loadFromAMC(filename, this.skeleton);
        return clip;
    }

    play(clip: MotionClip): void
    {
        this.stop();
        this.clip = clip;
        this.currentPose = this.clip.frames[0];
    }

    stop(): void
    {
        this.clip = null;
        this.currentTime = 0;

        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;
    }

    overlay(clip: MotionClip, transitionFrames: number): void
    {
        this.overlayQueue.push(clip);
        this.overlayTransitionFrames.push(transitionFrames);
    }

    update(deltaTime: number): void
    {
        // If the motion queue is empty, then do nothing
        if(!this.clip)
            return;

        // Advance the time
        this.currentTime += deltaTime;

        // Set the next frame number
        let currentFrame = Math.floor(this.currentTime * this.fps);

        if(currentFrame >= this.clip.frames.length)
        {
            currentFrame = 0;
            this.currentTime = 0;   
            this.currentPose = this.clip.frames[0];
        }

        let overlayFrame = 0;

        // Advance the overlay clip if there is one
        if(this.overlayQueue.length > 0)
        {
            this.overlayTime += deltaTime;

            overlayFrame = Math.floor(this.overlayTime * this.fps);

            if(overlayFrame >= this.overlayQueue[0].frames.length)
            {
                this.overlayQueue.shift();
                this.overlayTransitionFrames.shift();
                this.overlayTime = 0;
                overlayFrame = 0;
            }
        }

        const pose = this.computePose(currentFrame, overlayFrame);
        this.skeleton.update(pose, this.useAbsolutePosition);
    }

    public getQueueCount(): number
    {
        return this.overlayQueue.length;
    }

    private computePose(currentFrame: number, overlayFrame: number): Pose
    {
        // If there is an active overlay track
        if(this.overlayQueue.length > 0)
        {
            // Start out with the unmodified overlay pose
            const overlayPose = this.overlayQueue[0].frames[overlayFrame].clone();

            let alpha = 0;

            // Fade in the overlay
            if(overlayFrame < this.overlayTransitionFrames[0])
            {
                alpha = 1 - overlayFrame / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }
            // Fade out the overlay
            else if (overlayFrame > this.overlayQueue[0].frames.length - this.overlayTransitionFrames[0])
            {
                alpha = 1 - (this.overlayQueue[0].frames.length - overlayFrame) / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }

            if(!this.useAbsolutePosition)
            {
                const relativeOverlayPosition = gfx.Vector3.copy(this.overlayQueue[0].frames[overlayFrame].rootPosition);
                relativeOverlayPosition.subtract(this.overlayPose.rootPosition);

                const relativePosition = gfx.Vector3.copy(this.clip!.frames[currentFrame].rootPosition);
                relativePosition.subtract(this.currentPose.rootPosition);

                relativeOverlayPosition.lerp(relativeOverlayPosition, relativePosition, alpha);
                this.position.add(relativeOverlayPosition);

                this.overlayPose = this.overlayQueue[0].frames[overlayFrame];
                this.currentPose = this.clip!.frames[currentFrame];
            }
            
            return overlayPose;
        }
        // Motion is entirely from the base track
        else
        {
            if(!this.useAbsolutePosition)
            {
                const relativePosition = gfx.Vector3.copy(this.clip!.frames[currentFrame].rootPosition);
                relativePosition.subtract(this.currentPose.rootPosition);
                this.position.add(relativePosition);
                this.currentPose = this.clip!.frames[currentFrame];
            }

            return this.clip!.frames[currentFrame];
        }
    }

    // Entry function for the recursive call
    toggleAxes(showAxes: boolean): void
    {
        this.toggleAxesRecursive(this.skeleton, showAxes);
    }

    private toggleAxesRecursive(object: gfx.Transform3, showAxes: boolean): void
    {
        // Set the visibility of the coordinate axes
        if(object instanceof gfx.Axes3)
        {
            object.visible = showAxes;
        }
        // Set the visibility of all objects that are not coordinate axes
        else if(object instanceof gfx.Mesh || object instanceof gfx.MeshInstance || object instanceof gfx.Line3)
        {
            object.visible = !showAxes;
        }

        // Call the function recursively for each child node
        object.children.forEach((child: gfx.Transform3) => {
            this.toggleAxesRecursive(child, showAxes);
        });
    }
}