const majors = await MajorService.findAll();
res.render("user/register", { majors });