var virt = require("virt"),
    propTypes = require("prop_types");


var TodoItemPrototype;


module.exports = TodoItem;


function TodoItem(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(TodoItem, "TodoItem");

TodoItemPrototype = TodoItem.prototype;

TodoItem.propTypes = {
    id: propTypes.number.isRequired,
    onDestroy: propTypes.func.isRequired,
    text: propTypes.string.isRequired
};

TodoItem.contextTypes = {
    ctx: propTypes.object.isRequired
};

TodoItemPrototype.render = function() {
    return (
        virt.createView("View",
            virt.createView("TextView", this.props.text),
            virt.createView("Button", {
                onClick: this.props.onDestroy
            }, "x")
        )
    );
};
