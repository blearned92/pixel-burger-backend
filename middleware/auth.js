const express = require('express');

const ensureIdOrAdminAuth = (req, res, next) => {
  console.log(req.session.user.user_id);
  console.log(parseInt(req.params.id))
  if (req.session.user.user_id === parseInt(req.params.id) || req.session.user.user_type === 'admin') {
    return next();
  } else {
    res.status(403).json({ message: "You're not authorized to for this action" });
  }
}

const ensureAuthentication = (req, res, next) => {
    if (req.session.authenticated) {
      return next();
    } else {
      res.status(403).json({ message: "You're not authorized to for this action" });
    }
}

const ensureAdminAuthentication = (req, res, next) => {
    if (req.session.authenticated && req.session.user.user_type === 'admin') {
      return next();
    } else {
      res.status(403).json({ message: "You're not authorized to for this action" });
    }
}

module.exports = {
    ensureAdminAuthentication,
    ensureAuthentication,
    ensureIdOrAdminAuth
};