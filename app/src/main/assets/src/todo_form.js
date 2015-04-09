var virt = require("virt"),
    dispatcher = require("./dispatcher"),
    TodoStore = require("./todo_store");


var TodoFormPrototype;


module.exports = TodoForm;


function TodoForm(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.state = {
        name: "Default State"
    };

    this.onSubmit = function(e) {
        return _this.__onSubmit(e);
    };

    this.onInput = function(e) {
        return _this.__onInput(e);
    };
}
virt.Component.extend(TodoForm, "TodoForm");

TodoFormPrototype = TodoForm.prototype;

TodoFormPrototype.__onSubmit = function() {
    var _this = this;

    this.refs.name.getValue(function(error, data) {
        var value = data.value;

        if (value) {
            dispatcher.handleViewAction({
                actionType: TodoStore.consts.TODO_CREATE,
                text: value
            });

            _this.setState({
                name: ""
            });
        }
    });
};

TodoFormPrototype.render = function() {
    return (
        virt.createView("View", {
                orientation: "horizontal"
            },
            virt.createView("Input", {
                type: "text",
                name: "name",
                ref: "name",
                placeholder: "Todo",
                value: this.state.name
            }),
            virt.createView("Button", {
                onClick: this.onSubmit
            }, "Create")
        )
    );
};
