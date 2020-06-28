import MyObject from "../Common/MyObject";
import QuestionBehavior from "./Behavior/QuestionBehavior";
import AnswerBehavior from "./Behavior/AnswerBehavior";

export default class QuestionScene {
    root: MyObject;
    rootQuestion: QuestionBehavior;
    answerList: MyObject[];

    constructor(data) {
        // todo: 应该依据外部 data 来初始化

        // 初始化题面
        this.root = new MyObject();
        this.rootQuestion = this.root.CreateBehavior("Question", QuestionBehavior);

        // 初始化答案
        this.answerList = new Array();
        this.addAnswer({});

        this.show();

        // 模拟用户操作

        // 给出操作反馈
    }

    private addAnswer(data) {
        let answer = new MyObject();
        answer.CreateBehavior("Answer", AnswerBehavior, data);

        this.answerList.push(answer);
    }

    public Update () {
        this.root.Update();
    }

    private show () {
        // 打包成一个 data
    }
}