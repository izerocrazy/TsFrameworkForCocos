export default class Event {
    public name: string;
    public data: number | string | {};

    constructor(name, data) {
        this.name = name;
        this.data = data;
    }
}