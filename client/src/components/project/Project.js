import React, { Fragment, useState, useEffect } from "react";
import ProjectTop from "../project/layout/ProjectTop";
import ProjectSide from "../project/layout/ProjectSide";
import Issues from "../issues/Issues";
import Issue from "../issue/Issue";
import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getProjectById } from "../../actions/project";
import { getPeople } from "../../actions/people";
import { getTeams } from "../../actions/team";

function Project({
  match,
  getProjectById,
  getPeople,
  getTeams,
  project: { project, loading, refreshIssue },
  people: { people },
  team: { teams },
}) {
  useEffect(() => {
    getProjectById(match.params.project_id);
    getPeople();
    getTeams();
  }, [getProjectById, match.params.project_id, getPeople, getTeams]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssue, setSelectedIssue] = useState({
    _id: "",
    progress: {},
    assignee: [],
    date: "",
    comments: [],
    issueType: "",
    issueName: "",
    issueNumber: "",
    summary: "",
    description: "",
    priority: "",
    name: "",
    user: "",
    dueDate: "",
  });

  let issueIndex;

  /* {
    project &&
      (issueIndex = project.issues
        .map((issue) => issue._id)
        .indexOf(selectedIssue._id));
  }
  {
    refreshIssue &&
      setSelectedIssue({
        ...selectedIssue,
        comments: project.issues[issueIndex].comments,
      });
  }
*/

  return (
    <Fragment>
      {loading || !project ? (
        <Spinner />
      ) : (
        <section className="project">
          <ProjectTop
            project={project}
            params={match.params.project_id}
            setSearchTerm={setSearchTerm}
          />
          <ProjectSide
            project={project}
            people={people}
            teams={teams}
            params={match.params.project_id}
            selectedIssue={selectedIssue}
            setSelectedIssue={setSelectedIssue}
            searchTerm={searchTerm}
          />
          <div className="project__main">
            <Issue
              selectedIssue={selectedIssue}
              setSelectedIssue={setSelectedIssue}
              params={match.params.project_id}
              project={project}
              refreshIssue={refreshIssue}
            />
          </div>
        </section>
      )}
    </Fragment>
  );
}

Project.propTypes = {
  getProjectById: PropTypes.func.isRequired,
  getTeams: PropTypes.func.isRequired,
  getPeople: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  people: PropTypes.object.isRequired,
  team: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  project: state.project,
  people: state.people,
  team: state.team,
});

export default connect(mapStateToProps, {
  getProjectById,
  getPeople,
  getTeams,
})(Project);
