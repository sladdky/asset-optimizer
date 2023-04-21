# AH-MQTTROUTER

Naive implementation of MqttRouter for <a href="https://github.com/mqttjs/MQTT.js">MQTT.js</a> library. Route handling similar to Express's router.

<br>

## Table of contents
* [installation](#installation)
* [usage](#usage)
* [API](#api)
* [MqttRouteCallback (fire-and-forget)](#fire-and-forget)
* [MqttRouteCallback (request-response) + MqttRequestor](#request-reponse)
* [middleware](#middleware)
* [re-routing](#re-routing)


<br>


<a name="installation"></a>
## Instalation
```sh
npm install @sladdky/ah-mqttrouter --save
```

<br>

<a name="usage"></a>
## Usage
```sh
import { connect } from 'mqtt';
import { MqttRouter } from '@sladdky/ah-mqttrouter'

const onMyMqttTopic1 = (request, response, next) => {
  //...your route logic
}
const onMyMqttTopic2 = (request, response, next) => {
  //...your route logic
}

const mqttClient = connect(<mqtt://url>);
const mqttRouter = new MqttRouter(mqttClient, {
  routes: [
    {topic: 'my-mqtt-topic-1', callback: [onMyMqttTopic1]},
    {topic: 'my-mqtt-topic-2', callback: [onMyMqttTopic2]},
  ]
});
```

<br>

<a name="api"></a>
## API

* <code>mqttRouter.<b>subscribe(topic: string, callback: MqttRouteCallback | MqttRouteCallback[])</b></code>
* <code>mqttRouter.<b>unsubscribe(topic: string, callback: MqttRouteCallback | MqttRouteCallback[])</b></code>
* <code>mqttRouter.<b>publish(topic: string, message: string | Buffer, opts?: IClientPublishOptions, callback?: PacketCallback | undefined): MqttClient;
</b></code>

<br>


<a name="fire-and-forget"></a>
## MqttRouteCallback (Fire-and-Forget)
That's MQTT primary usage. One MqttClient sends a message to certain topic and other MqttClients that are subscribed to that topic, receive the message. No strings attached, no response expected.

1. mqtt message fired from some client:
```sh
topic: "my-mqtt-topic"
message: "This is my message."
```
2. example route implementation:
```sh
const onMyMqttTopic = (request, response, next) => {
  const { topic, payload } = request

  saveToDB(`topic: ${topic}, payload: ${payload}`)

  response.send('Message received and I saved it to the database')
}
```

<br>

<a name="request-reponse"></a>
## MqttRouteCallback (Request-Response)
If you need request-response type of communication it's possible. The message is **always** expected to be stringified JSON.

1. JSON must be in this form:
```sh
{
  responseTopic: "random-topic-the-requester-must-subscribe-before-sending",
  message: "This is my message"
}
```

2. mqtt message sent will look like this
```sh
topic: "my-mqtt-topic"
message: '{"responseTopic":"random-topic-the-requester-must-subscribe-before-sending","message":"This is my message"}'
```

3. example route implementation:
```sh
const onMyMqttTopic = (request, response, next) => {
  const { topic, payload } = request

  saveToDB(`topic: ${topic}, payload: ${payload}`)
}
```

The MQTTclient that is requesting has to subscribe to 'responseTopic' and unsubscribe after the response comes back. You can either handle this situation youself or use asynchronous mqttRequestor.

Example:
```sh
...
import { createMqttRequestor } from '@sladdky/ah-mqttrouter/lib/utils'

const mqttRouter = new MqttRouter(mqttClient)
const mqttRequestor = createMqttRequestor(mqttRouter)
mqttRequestor.send('my-mqtt-topic', 'This is my message').then((response) => {
  console.log(response.payload)
})
```

<br>


<a name="middleware"></a>
## Middleware (workaround)
Please add your middleware logic as a route callback.

Example:
```sh
const onAuthMiddleware = (request, response, next) => {
  if (!isLoggedIn) {
    //...not-allowed to proccess
  }

  next()
}
const onMyMqttTopic = (request, response) => {
  //...your route logic
}

mqttRouter.subscribe('my-mqtt-topic', [onAuthMiddleware, onMyMqttTopic])
```

<br>

<a name="re-routing"></a>
## Re-routing
Not implemented.

<br><br>

<sub><sup>based on ts-npm-package-boilerplate</sub></sup>