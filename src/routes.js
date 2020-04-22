const rolesController = require('./controllers/rolesController');
const usersController = require('./controllers/usersController');
const requestsMapsController = require('./controllers/requestsMapsController');
const securityFilter = require('./config/securityFilter');

const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const routes = express.Router();

//----------------ROLES ROUTES

routes.post("/roles", celebrate({
    [Segments.HEADERS] : Joi.object({
        authorization: Joi.string().required()
    }).unknown(),
    [Segments.BODY] : Joi.object().keys({
        authority: Joi.string().required()
    })
}), securityFilter, rolesController.create);

routes.get("/roles", celebrate({
    [Segments.HEADERS] : Joi.object({
        authorization: Joi.string().required()
    }).unknown(),
    [Segments.QUERY] : Joi.object().keys({
        page: Joi.number()
    })
}), securityFilter, rolesController.findAll);

routes.get("/roles/:id", celebrate({
    [Segments.HEADERS] : Joi.object({
        authorization: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS] : Joi.object().keys({
        id: Joi.number().required()
    })
}), securityFilter, rolesController.findById);

routes.delete("/roles/:id", celebrate({
    [Segments.HEADERS] : Joi.object({
        authorization: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS] : Joi.object().keys({
        id: Joi.number().required()
    })
}), securityFilter, rolesController.delete);

//----------------REQUESTS MAPS ROUTES

routes.post("/requestsMaps", celebrate({
    [Segments.HEADERS] : Joi.object({
        authorization: Joi.string().required()
    }).unknown(),
    [Segments.BODY] : Joi.object().keys({
        httpMethod: Joi.string().required().min(3),
        url: Joi.string().required().min(5).max(30),
        roles: Joi.array().default([]).items(Joi.object({
            role_id: Joi.number().required()
        }))
    })
}), securityFilter, requestsMapsController.create);

routes.delete("/requestsMaps/:id", celebrate({
    [Segments.HEADERS] : Joi.object({
        authorization: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS] : Joi.object().keys({
        id: Joi.number().required()
    })
}), securityFilter, requestsMapsController.delete);

routes.get("/requestsMaps", celebrate({
    [Segments.HEADERS] : Joi.object({
        authorization: Joi.string().required()
    }).unknown(),
    [Segments.QUERY] : Joi.object().keys({
        page: Joi.number()
    })
}), securityFilter, requestsMapsController.findAll);

//----------------USERS ROUTES

routes.post("/users", celebrate({
    [Segments.BODY] : Joi.object().keys({
        name: Joi.string().required().min(3),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(5).max(30),
        username: Joi.string().required(),
        roles: Joi.array().default([]).items(Joi.object({
            role_id: Joi.number().required()
        }))
    })
}), usersController.create);

routes.post("/users/authentication", celebrate({
    [Segments.BODY] : Joi.object().keys({
        password: Joi.string().required().min(5).max(30),
        username: Joi.string().required()
    })
}), usersController.authentication);

routes.get("/users", celebrate({
    [Segments.HEADERS] : Joi.object({
        authorization: Joi.string().required()
    }).unknown(),
    [Segments.QUERY] : Joi.object().keys({
        page: Joi.number()
    })
}), securityFilter, usersController.findAll);

routes.get("/users/:id", celebrate({
    [Segments.HEADERS] : Joi.object({
        authorization: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS] : Joi.object().keys({
        id: Joi.number().required()
    })
}), securityFilter, usersController.findById);

routes.put("/users/:id", celebrate({
    [Segments.HEADERS] : Joi.object({
        authorization: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS] : Joi.object().keys({
        id: Joi.number().required()
    }),
    [Segments.BODY] : Joi.object().keys({
        name: Joi.string().min(3),
        email: Joi.string().email(),
        username: Joi.string(),
        password: Joi.string().min(5).max(30),
        roles: Joi.array().default([]).items(Joi.object({
            role_id: Joi.number().required()
        }))
    })
}), securityFilter, usersController.update);

routes.delete("/users/:id", celebrate({
    [Segments.HEADERS] : Joi.object({
        authorization: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS] : Joi.object().keys({
        id: Joi.number().required()
    })
}), securityFilter, usersController.delete);

module.exports = routes;