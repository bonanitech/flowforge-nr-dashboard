module.exports = function (RED) {
    /**
     *
     * @param {*} config
     */
    function UIGroupNode (config) {
        const node = this
        RED.nodes.createNode(node, config)

        // which page are we rendering this page in
        const page = RED.nodes.getNode(config.page)
        node.log('UI Page Constructor')

        node.on('close', function (removed, done) {
            node.deregister() // deregister self
            done()
        })

        /**
         * Function for widgets to register themselves with this page
         * Calls the parent UI Base "register" function and registers this page,
         * along with the widget
         * @param {*} widget
         */
        node.register = function (widgetNode, widgetConfig, widgetEvents) {
            const group = config
            page.register(group, widgetNode, widgetConfig, widgetEvents)
        }

        node.deregister = function (widgetNode) {
            const group = config
            page.deregister(group, widgetNode)
        }
    }
    RED.nodes.registerType('ui-group', UIGroupNode)
}
