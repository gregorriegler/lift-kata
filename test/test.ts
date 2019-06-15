import {Lift} from "../src/lift";
import {expect} from "chai";
import FloorArrivalHandler = Lift.FloorArrivalHandler;

describe('Lift', function () {
    let lift: Lift;
    let fakeArrivalHandler: FakeArrivalHandler;

    beforeEach(function () {
        fakeArrivalHandler = new FakeArrivalHandler();
        lift = new Lift(-1, 3, fakeArrivalHandler)
    });

    it('is limited to shafts upper boundary', function () {
        expect(() => lift.goto(4))
            .to.throw(Lift.TargetOutOfBoundsError)
    });

    it('is limited to shafts lower boundary', function () {
        expect(() => lift.goto(-2))
            .to.throw(Lift.TargetOutOfBoundsError)
    });

    it('starts at 0', function () {
        expect(lift.floor()).to.equal(0);
    });

    it('idles', function () {
        lift.tick(3)

        expect(lift.floor()).to.equal(0);
    });


    it('can go up a floor', function () {
        lift.goto(1);

        lift.tick();

        expect(lift.floor()).to.equal(1);
    });

    it('can go down a floor', function () {
        lift.goto(-1);

        lift.tick();

        expect(lift.floor()).to.equal(-1);
    });

    it('goes one floor per tick', function () {
        lift.goto(2);

        lift.tick();

        expect(lift.floor()).to.equal(1);
    });

    it('stops at target', function () {
        lift.goto(2);

        lift.tick(3);

        expect(lift.floor()).to.equal(2);
    });

    it('notifies for arrival on target floor', function () {
        lift.goto(2);

        lift.tick(2);

        expect(fakeArrivalHandler.arrivals).to.have.members([2])
    });

    it('doesnt notify while driving', function () {
        lift.goto(2);

        lift.tick(1);

        expect(fakeArrivalHandler.arrivals).to.be.empty
    });

    it('stops for intermediate gotos on the way up', function () {
        lift.goto(3);

        lift.goto(1);
        lift.tick(3);

        expect(fakeArrivalHandler.arrivals).to.have.ordered.members([1, 3])
    });

    it('stops for intermediate gotos on the way down', function () {
        lift.goto(3);
        lift.tick(3)
        lift.goto(-1);

        lift.goto(0);
        lift.tick(4);

        expect(fakeArrivalHandler.arrivals).to.have.ordered.members([3, 0, -1])
    });

    it('stops on all intermediate gotos on the way up', function () {
        lift.goto(3);
        lift.goto(1);
        lift.goto(2);
        lift.tick(3);

        expect(fakeArrivalHandler.arrivals).to.have.ordered.members([1, 2, 3])
    });

    it('when gotos are in opposite directions the first comes first serves', function () {
        lift.goto(2);
        lift.goto(-1);

        lift.tick(5);

        expect(fakeArrivalHandler.arrivals).to.have.ordered.members([2, -1])
    });

    it('can be called', function () {
        lift.call(2, Lift.Direction.Up)

        lift.tick(2)

        expect(lift.floor()).to.equal(2);
    })

    it('will stop on its way, when called within its path', function () {
        lift.goto(3)

        lift.tick()
        lift.call(2, Lift.Direction.Up)
        lift.tick(2)

        expect(lift.floor()).to.equal(3);
        expect(fakeArrivalHandler.arrivals).to.have.ordered.members([2, 3])
    })

    it('first come first serve', function () {
        lift.call(2, Lift.Direction.Up)
        lift.goto(-1)

        lift.tick(6)

        expect(fakeArrivalHandler.arrivals).to.have.ordered.members([2, -1])
        expect(lift.floor()).to.equal(-1);
    })

    it('respects gotos to come first', function () {
        lift.call(2, Lift.Direction.Up)
        lift.call(-1, Lift.Direction.Up)
        lift.tick(2)
        lift.goto(3)
        lift.tick(10)

        expect(fakeArrivalHandler.arrivals).to.have.ordered.members([2, 3, -1])
        expect(lift.floor()).to.equal(-1);
    })

    it('can handle crazy calls', function () {
        lift.call(2, Lift.Direction.Down)
        lift.call(-1, Lift.Direction.Up)
        lift.tick(2)
        lift.goto(1)
        lift.tick(10)

        expect(fakeArrivalHandler.arrivals).to.have.ordered.members([2, 1, -1])
        expect(lift.floor()).to.equal(-1);
    })

    class FakeArrivalHandler implements FloorArrivalHandler {
        public arrivals: number[] = [];

        arrivedAt(floor: number): void {
            this.arrivals.push(floor);
        }
    }

});