import {Lift} from "../src/lift";
import {expect} from "chai";

describe('Lift', function() {
    it('starts at 0', function() {
        let lift = new Lift();

        expect(lift.position()).to.equal(0);
    })

    it('can go up a floor', function() {
        let lift = new Lift();
        lift.registerTarget(1);
        lift.tick();

        expect(lift.position()).to.equal(1);
    })

    it('can go down a floor', function() {
        let lift = new Lift();
        lift.registerTarget(-1);
        lift.tick();

        expect(lift.position()).to.equal(-1);
    })

    it('goes one floor per tick', function() {
        let lift = new Lift();
        lift.registerTarget(2);
        lift.tick();

        expect(lift.position()).to.equal(1);
    })

    it('stops at target', function() {
        let lift = new Lift();
        lift.registerTarget(2);
        lift.tick();
        lift.tick();
        lift.tick();

        expect(lift.position()).to.equal(2);
    })

    it('is limited to shafts upper boundary', function() {
        let lift = new Lift(0, 3);

        expect(() => lift.registerTarget(4)).to.throw(Lift.Boundary.TargetOutOfBoundsError)
    })

    it('is limited to shafts lower boundary', function() {
        let lift = new Lift(0, 3);

        expect(() => lift.registerTarget(-1)).to.throw(Lift.Boundary.TargetOutOfBoundsError)
    })

})