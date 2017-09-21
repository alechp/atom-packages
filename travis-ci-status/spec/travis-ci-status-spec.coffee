TravisCiStatus = require '../lib/travis-ci-status'

describe "TravisCiStatus", ->
  workspaceElement = null
  gitPath = "tombell/travis-ci-status"
  repoURL = "https://github.com/#{gitPath}.git"
  defaultRemote = "origin"

  beforeEach ->
    waitsForPromise ->
      atom.packages.activatePackage('status-bar')

    spyOn(TravisCiStatus, "isTravisProject").andCallFake((cb) -> cb(true))
    atom.config.set('travis-ci-status.travisCiRemoteName', defaultRemote)

    workspaceElement = atom.views.getView(atom.workspace)
    jasmine.attachToDOM(workspaceElement)

  describe "when the travis-ci-status:toggle event is triggered", ->
    beforeEach ->
      spyOn(atom.project, "getRepositories").andReturn([{
        getConfigValue: (name) ->
          "git@github.com:test/test.git"
      }])

    it "attaches and then detaches the view", ->
      expect(workspaceElement.querySelector(".travis-ci-status")).not.toExist()

      waitsForPromise ->
        atom.packages.activatePackage("travis-ci-status")

      runs ->
        expect(workspaceElement.querySelector(".travis-ci-status")).toExist()

  describe "gets final remote name", ->
    gitPath =
    repo =
      getConfigValue: (name) ->
        repoURL
      getOriginURL: ->
        repoURL

    it "uses atom default if no repo provided", ->
      spyOn(atom.project, "getRepositories").andReturn([repo])
      atom.config.set('travis-ci-status.travisCiAltRemotes', '{}')
      remote = TravisCiStatus.getFinalRemote(null)
      expect(remote).toEqual(defaultRemote)

    it "uses default remote if invalid JSON override", ->
      spyOn(atom.project, "getRepositories").andReturn([repo])
      atom.config.set('travis-ci-status.travisCiAltRemotes', 'invalid JSON')
      remote = TravisCiStatus.getFinalRemote(null)
      expect(remote).toEqual(defaultRemote)

      atom.config.set('travis-ci-status.travisCiAltRemotes', undefined)
      remote = TravisCiStatus.getFinalRemote(null)
      expect(remote).toEqual(defaultRemote)

    it "uses default remote if override doesn't match gitPath", ->
      spyOn(atom.project, "getRepositories").andReturn([repo])
      atom.config.set('travis-ci-status.travisCiAltRemotes', '{"another-user/their-repo": "staging"}')
      remote = TravisCiStatus.getFinalRemote(null)
      expect(remote).toEqual(defaultRemote)

    it "uses override remote if matches gitPath", ->
      spyOn(atom.project, "getRepositories").andReturn([repo])
      atom.config.set('travis-ci-status.travisCiAltRemotes', '{"tombell/travis-ci-status": "staging"}')
      remote = TravisCiStatus.getFinalRemote(null)
      expect(remote).toEqual("staging")

    it "returns undefined if no repo found", ->
      remote = TravisCiStatus.getFinalRemote(null)
      expect(remote).toBeUndefined()

  describe "can get the nwo if the project is a github repo", ->
    it "gets nwo of https repo ending in .git", ->
      spyOn(atom.project, "getRepositories").andReturn([{
        getConfigValue: (name) ->
          "https://github.com/tombell/travis-ci-status.git"
      }])

      nwo = TravisCiStatus.getNameWithOwner()
      expect(nwo).toEqual("tombell/travis-ci-status")

    it "gets nwo of https repo not ending in .git", ->
      spyOn(atom.project, "getRepositories").andReturn([{
        getConfigValue: (name) ->
          "https://github.com/tombell/test-status"
      }])

      nwo = TravisCiStatus.getNameWithOwner()
      expect(nwo).toEqual("tombell/test-status")

    it "gets nwo of ssh repo ending in .git", ->
      spyOn(atom.project, "getRepositories").andReturn([{
        getConfigValue: (name) ->
          "git@github.com:tombell/travis-ci-status.git"
      }])

      nwo = TravisCiStatus.getNameWithOwner()
      expect(nwo).toEqual("tombell/travis-ci-status")

    it "gets nwo of ssh repo not ending in .git", ->
      spyOn(atom.project, "getRepositories").andReturn([{
        getConfigValue: (name) ->
          "git@github.com:tombell/test-status"
      }])

      nwo = TravisCiStatus.getNameWithOwner()
      expect(nwo).toEqual("tombell/test-status")
