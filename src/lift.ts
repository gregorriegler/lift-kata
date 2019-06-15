class Lift {
    private target: number;
    private pos: number;
    private boundary: Lift.Boundary;

    constructor(lowerBound?: number, upperBound?: number) {
        this.boundary = new Lift.Boundary(
            lowerBound !== undefined ? lowerBound : -1,
            upperBound !== undefined ? upperBound : 3
        )
        this.target = 0;
        this.pos = 0;
    }

    position() {
        return this.pos
    }

    registerTarget(target: number) {
        this.boundary.assertInBounds(target)
        this.target = target
    }

    tick() {
        if (this.target > this.pos) {
            this.pos++;
        } else if (this.target < this.pos) {
            this.pos--;
        }
    }


}

namespace Lift {
    export class Boundary {
        private lowerBound: number;
        private upperBound: number;

        constructor(lowerBound: number, upperBound: number) {
            this.lowerBound = lowerBound;
            this.upperBound = upperBound;
        }

        public assertInBounds(target: number) {
            if (this.isOutOfBounds(target)) throw new Lift.Boundary.TargetOutOfBoundsError
        }

        public isOutOfBounds(target: number) {
            return target < this.lowerBound || target > this.upperBound;
        }

        static TargetOutOfBoundsError = class extends Error {

        }
    }
}

export {Lift}