{
  description = "Bun2Nix minimal sample";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.11";
    flake-parts.url = "github:hercules-ci/flake-parts";

    bun2nix.url = "github:nix-community/bun2nix?tag=2.0.7";
    bun2nix.inputs.nixpkgs.follows = "nixpkgs";

    fenix = {
      url = "github:nix-community/fenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "aarch64-darwin"
        "aarch64-linux"
        "i686-linux"
        "x86_64-darwin"
        "x86_64-linux"
      ];

      perSystem =
        {
          config,
          pkgs,
          system,
          ...
        }:
        {
          _module.args.pkgs = import inputs.nixpkgs {
            inherit system;
            overlays = [
            ];
          };

          packages = {
            # Produce a package for this template with bun2nix in
            # the overlay
            default = pkgs.callPackage ./default.nix { };
          };

          devShells.default = pkgs.mkShell {
            packages = with pkgs; [
              bun
            ];

            shellHook = ''
              bun install --frozen-lockfile
            '';
          };
        };
    };
}
