---
to: src/scheduler/jobs/<%= h.inflection.camelize(name, true) %>.job.ts
---
import { Job } from "agenda";
import moment from "moment-timezone";
import { Agenda } from "../agenda";

export class <%= h.inflection.camelize(name) %>Job {
  static jobName = "<%= h.inflection.camelize(name) %>";
  static create(data: any) {
    return Agenda.create(this.jobName, data);
  }
  static async execute(job: Job) {
    console.log("Execute Job " + <%= h.inflection.camelize(name) %>Job.jobName, moment().format());
  }
}

export default <%= h.inflection.camelize(name) %>Job;
