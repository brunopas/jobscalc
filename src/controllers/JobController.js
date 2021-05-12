const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
    create(req, res) {
        return res.render("job");
    },

    async save(req, res) {
        await Job.create({
            name: req.body.name,
            daily_hours: req.body.daily_hours,
            total_hours: req.body.total_hours,
            created_at: Date.now(),
        });

        return res.redirect("/");
    },

    async show(req, res) {
        const jobId = req.params.id;
        const jobs = await Job.get();

        const job = jobs.find((job) => Number(job.id) === Number(jobId));

        if (!job) {
            return res.send("Job not found!");
        }

        const profile = await Profile.get();

        job.budget = JobUtils.calculateBudget(job, profile.value_hour);

        return res.render("job-edit", { job });
    },

    async update(req, res) {
        const jobId = req.params.id;

        const updatedJob = {
            name: req.body.name,
            total_hours: req.body.total_hours,
            daily_hours: req.body.daily_hours,
        };

        await Job.update(updatedJob, jobId);

        res.redirect("/job/" + jobId);
    },

    async delete(req, res) {
        const jobId = req.params.id;

        await Job.delete(jobId);

        return res.redirect("/");
    },
};
