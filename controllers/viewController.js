const express = require('express');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');




exports.checkBodyForEmail = (req, res, next) =>  {

    if(!req.body.email){
        return res.status(404).json({
            status: 'fail',
            message: 'Can not find parameter name'
        });
    }

    next();
}


exports.getHomePage = (req, res) => {
    res.status(200).render('mathew/home', {
        Title: 'Mathew Maciel - Home Page'
    });
};

exports.getContactPage = (req, res) => {
    res.status(200).render('mathew/contact',{
        Title: 'Mathew Maciel - Contact Page'
    });
}

exports.getMusicPage = (req, res) => {
    res.status(200).render('mathew/music',{
        Title: 'Mathew Maciel - Music Page'
    });  
}

exports.getVideoPage = (req, res) => {
    res.status(200).render('mathew/videos',{
        Title: 'Mathew Maciel - Video Page'
    });
}

exports.getBioPage = (req, res) =>{
    res.status(200).render('mathew/bio',{
        Title: 'Mathew Maciel - Bio Page'
    });
}

exports.getAboutPage = (req, res) => {
    res.status(200).render('mathew/about',{
        Title: 'Mathew Maciel - About Page'
    });
}


exports.getConstructionPage = (req, res) => {
    res.status(200).render('mathew/construction',{
        Title: 'Mathew Maciel - Construction Page'
    });  
}


exports.login = (req, res) => {
    res.status(200).render('login',{
        Title: 'Mathew Maciel- Login Page'
    });  
}


exports.postContact = catchAsync( async (req, res) => {

    const {name, email, message} = req.body;

    // Check if email exists
    if(!email || !message){
        return next(new AppError('Please provide email and message!', 400));
    }

    const newContact = await {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message       
    };

    const toHost = await {
        name: req.body.name,
        email: 'mathewmacielmusic@gmail.com',
        userEmail: req.body.email,
        message: req.body.message       
    };

      const url = `${req.protocol}://${req.get('host')}/`;
      await new Email(newContact, url).sendWelcome();
      await new Email(toHost, url).sendToHost();

      res.status(200).json({
        status: 'success',
        message: 'email sent!'
      });

});


exports.postSubscriber = catchAsync( async(req, res) => {
    const email = req.body.email;
    console.log(req.body);

    // Check if email exists
    if(!email){
        return next(new AppError('Please provide email and message!', 400));
    }

    const toHost_ = await {
        email: 'mathewmacielmusic@gmail.com',
        userEmail: req.body.email
    };

    const url = `${req.protocol}://${req.get('host')}/`;
    await new Email(toHost_, url).sendToHostSubscriber();

    res.status(200).json({
        status: 'success',
        message: 'email sent!'
      });

});



exports.viewAdmin = (req, res) => {
    res.status(200).render('admin/index');
}