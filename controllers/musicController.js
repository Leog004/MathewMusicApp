const express = require('express');
const fs = require('fs');
const music = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/music.json`));
const Music = require('./../models/musicModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');


exports.getAllMusic = catchAsync(async (req,res)=>{

        const features = new APIFeatures(Music.find(), req.query)
        .filter()
        .sort()
        .fields()
        .pagination();

        const musics = await features.query;
    
        res.status(200).json({
            status: 'success',
            message: 'Here is the data for music',
            app: 'Mathew Maciel Website',
            requestedAt: req.requestTime,
            result: musics.length,
            data:{
                musics
            }  
        });
});

exports.getMusic = catchAsync(async (req,res, next)=>{

    const music = await Music.findById(req.params.id);

    if(!music){ return next(new AppError('No Music found with that ID', 404)); }

    res.status(200).json({
        status: 'success',
        message: 'Here is the data that you are looking for',
        app: 'Mathew Maciel Website',
        data:{
            music
        }  
    });
});

exports.addMusic = catchAsync(async (req, res) =>{

    const newMusic = await Music.create(req.body);

    if(!newMusic){ return next(new AppError('Something went wrong with uploading a new music', 404)); }


    res.status(201).json({
        status: "success",
        data: {
            music: newMusic
        }
    });
});

exports.editMusic = catchAsync(async (req, res) => {

    const music = await Music.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!music){ return next(new AppError('No Music found with that ID', 404)); }


    res.status(200).json({
        status: 'success', 
        data: {
            music
        }
    });
});

exports.deleteMusic = catchAsync(async (req, res) => {

    await Music.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'Success', 
        data: null
    });
});