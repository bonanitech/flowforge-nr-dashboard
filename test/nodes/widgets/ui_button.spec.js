const helper = require('node-red-node-test-helper')
const should = require('should') // eslint-disable-line no-unused-vars
const sinon = require('sinon/lib/sinon.js')

// load test 1 standard test data (base, page, group, theme, button)
// eslint-disable-next-line no-unused-vars
const { getLoadedNodes, testData1 } = require('../fixtures/index.js')
const testFlow1 = testData1.flows
const nodeImports = testData1.getImports(null, ['ui_button'])

helper.init(require.resolve('node-red'))

describe('ui-button node', function () {
    beforeEach(function (done) {
        helper.startServer(done)
    })

    afterEach(function (done) {
        helper.unload()
        helper.stopServer(done)
    })

    const flow = [
        {
            id: 'node-ui-button',
            type: 'ui-button',
            z: 'tab-id',
            group: 'config-ui-group',
            name: '',
            label: 'button',
            order: 0,
            width: 0,
            height: 0,
            passthru: false,
            tooltip: '',
            color: '',
            bgcolor: '',
            className: '',
            icon: '',
            payload: 'I was clicked',
            payloadType: 'str',
            topic: 'topic',
            topicType: 'msg',
            x: 290,
            y: 180,
            wires: [
                []
            ]
        },
        ...testFlow1
    ]

    it('should be loaded', async function () {
        await helper.load(nodeImports, flow)
        verifyFlowLoaded(helper, flow)
        const button = helper.getNode('node-ui-button')
        should(button).be.an.Object()
    })

    it('should be registered with the ui-base', async function () {
        await helper.load(nodeImports, flow)
        verifyFlowLoaded(helper, flow)
        const base = helper.getNode('config-ui-base')
        should(base).be.an.Object()
        base.should.have.property('ui')
        base.ui.should.have.property('widgets')
        base.ui.widgets.has('node-ui-button').should.be.true()
    })

    it('should be registered with the ui-base with the correct defaults', async function () {
        // "runtime-event",{id:"runtime-state",payload:{state: 'stop', error:"missing-types", type:"warning",text:"notification.warnings.missing-types",types:activeFlowConfig.missingTypes},retain:true});
        await helper.load(nodeImports, flow)
        verifyFlowLoaded(helper, flow)
        const base = helper.getNode('config-ui-base')
        const widget = base.ui.widgets.get('node-ui-button')

        // base config should be correct
        widget.id.should.equal('node-ui-button')
        widget.type.should.equal('ui-button')

        // default UI component state
        widget.should.have.property('state')
        widget.state.should.have.property('enabled', true)
        widget.state.should.have.property('visible', true)

        // check we have our properties set correctly
        widget.should.have.property('props')
        widget.props.should.have.property('label', flow[0].label)
    })

    it('should emit a msg-input event via socketio when the node receives an input in Node-RED', async function () {
        await helper.load(nodeImports, flow)
        verifyFlowLoaded(helper, flow)
        const base = helper.getNode('config-ui-base')

        // mock a socket.io socket connection and add it to the connections lookup
        const socket = {
            id: 'fake-conn-id',
            emit: sinon.spy()
        }

        // add a fake connection so that button has somewhere to emit to and we can spy on it
        base.uiShared.connections['fake-conn-id'] = socket
        base.connections['fake-conn-id'] = socket

        // now send a message to the node
        const button = helper.getNode('node-ui-button')
        button.receive({})

        socket.emit.should.be.calledOnce()
        const args = socket.emit.args[0] // [0][0] is the event name, [0][1] is the payload
        args[0].should.equal('msg-input:' + button.id)
        args[1].should.be.an.Object()
        args[1].should.have.property('payload', 'I was clicked')
    })

    function verifyFlowLoaded (helper, flow) {
        const loadedNodes = getLoadedNodes(helper)
        loadedNodes.should.have.length(flow.length)
        loadedNodes.forEach(node => {
            const loadedNode = flow.find(item => item.id === node.id)
            should(loadedNode).be.an.Object()
            loadedNode.should.have.property('type', node.type)
        })
    }

    // eslint-disable-next-line no-unused-vars
    function debugPrintLoadedNodes (testInstance, helper) {
        // get a the full path to the test from .parent.parent.etc
        const pathItems = testInstance.test.titlePath()
        const padding = ' '.repeat(pathItems.length * 2)
        const testPath = testInstance.test.titlePath().join(' > ')
        console.log(`${padding}TEST: ${testPath}`)
        console.log(`${padding}  Loaded nodes:`)
        const loadedNodes = getLoadedNodes(helper)
        loadedNodes.forEach(node => {
            console.log(`${padding}  * ${JSON.stringify(node, null, 0)}`)
        })
    }
})
