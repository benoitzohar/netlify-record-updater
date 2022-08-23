#!/usr/bin/env node
import { program } from "commander";

import npmPackage from "../package.json";
import { run } from "./main";

program
  .version(npmPackage.version)
  .argument("<domain>", "Domain to update (e.g home.test.com)")
  .argument("<apiToken>", "Netlify API token")
  .option(
    "--ip <ip>",
    "New IP address of the domain (default: current public IP)"
  )
  .action(function (domain, apiToken, opts) {
    run(domain, apiToken, opts.ip);
  })
  .parse();
