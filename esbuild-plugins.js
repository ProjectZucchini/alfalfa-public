const fs = require("fs");

const copyPrismaArtifacts = {
  name: "copy-prisma-artifacts",
  setup(build) {
    build.onEnd(() => {
      const prismaDir = "node_modules/@alfalfa/database/generated/client";
      const filesToCopy = fs
        .readdirSync(prismaDir)
        .filter((file) =>
          file.match(
            /(schema\.prisma)|libquery_engine-rhel-openssl|libquery_engine-darwin/,
          ),
        );

      for (const file of filesToCopy) {
        fs.cpSync(
          `${prismaDir}/${file}`,
          `${build.initialOptions.outdir}/${file}`,
          {
            dereference: true,
            force: true,
            preserveTimestamps: true,
          },
        );
      }
    });
  },
};

// default export should be an array of plugins
module.exports = [copyPrismaArtifacts];
