const { request } = require("express")
const { response } = require("express")
const express = require("express")
const uuid = require("uuid")

const app = express()
const port = 3002
app.use(express.json())

const newOrder = []

// Middlewares: verificar se o ID passado existe;
const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = newOrder.findIndex(order => order.id === id)

    if (index < 0) {
        response.status(404).json({ error: "order not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}

// Middlewares : método da requisiçao
const methodUrl = (request, response, next) => {
    const method = request.method
    const url = request.path
    console.log("Method:", "[", method, "]", "-", "URL:", url)

    next()
}

// Lista de pedidos
app.get("/order", methodUrl, (request, response) => {
    response.json(newOrder)
})

// novo pedido
app.post("/order/:id", methodUrl, (request, response) => {
    const { order, clientName, price } = request.body
    const orderCreat = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    newOrder.push(orderCreat)

    response.status(201).json(orderCreat)
})

//Atualização do pedido
app.put("/order/:id", checkOrderId, methodUrl, (request, response) => {
    const index = request.userIndex
    const id = request.userId

    const { order, clientName, price, status } = request.body

    const updateOrder = { id, order, clientName, price, status: "Em preparação" }

    newOrder[index] = updateOrder

    return response.json(updateOrder)
})

// Deletar pedito
app.delete("/order/:id", checkOrderId, methodUrl, (request, response) => {
    const index = request.userIndex

    newOrder.splice(index, 1)

    response.status(204).json()
})

// status = pronto
app.patch("/order/:id", checkOrderId, methodUrl, (request, response) => {
    const index = request.userIndex
    const id = request.userId

    const { order, clientName, price } = newOrder[index]

    const orderReady = { id, order, clientName, price, status: 'Pedido pronto!' }

    newOrder[index] = orderReady

    return response.json(orderReady)
})


app.listen(port, () => {
    console.log(`🟢 started successfully port ${port}`)
})