module.exports = function (RED) {
    function TextInputNode (config) {
        const node = this

        // create node in Node-RED
        RED.nodes.createNode(this, config)

        // this ndoe need to store content/value from UI
        node.value = null

        // which group are we rendering this widget
        const group = RED.nodes.getNode(config.group)

        const evts = {
            onChange: true,
            onInput: function (msg, send) {
                if (config.passthru) {
                    send(msg)
                }
            }
        }

        // inform the dashboard UI that we are adding this node
        group.register(node, config, evts)

        node.on('close', async function (done) {
            done()
        })
    }

    RED.nodes.registerType('ui-text-input', TextInputNode)
}
