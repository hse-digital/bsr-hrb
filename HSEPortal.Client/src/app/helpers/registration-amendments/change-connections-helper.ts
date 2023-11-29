import { ApplicationService, Connections } from "src/app/services/application.service";
import { ChangeHelper, ChangedAnswersModel } from "./change-helper";

export class ChangeConnectionsHelper extends ChangeHelper {

    constructor(private applicationService: ApplicationService) {
        super();
    }

    getChanges(): ChangedAnswersModel[] {
        let original = this.applicationService.previousVersion?.Kbi?.Connections ?? {};
        let current = this.applicationService.currentVersion?.Kbi?.Connections ?? {};
        return this.getConnectionChanges(original, current, 0, this.applicationService.model.BuildingName!).filter(x => !!x).map(x => x!);
    }

    private getConnectionChanges(original: Connections, current: Connections, index: number, sectionName: string) {
        let groupName = "connections/";
        let changes: (ChangedAnswersModel | undefined)[] = [];

        changes.push(this.getFieldChange(this.getConnectionTypes(original.StructureConnections), this.getConnectionTypes(current.StructureConnections), "Connections between the structures", "Connections between the structures", groupName + "structure-connections", sectionName, index));
        changes.push(this.getFieldChange(original.OtherHighRiseBuildingConnections, current.OtherHighRiseBuildingConnections, "Connected to other high-rise residential buildings?", "Connected to other high-rise residential buildings?", groupName + "other-high-rise-building-connections", sectionName, index));
        changes.push(this.getFieldChange(this.getConnectionTypes(original.HowOtherHighRiseBuildingAreConnected), this.getConnectionTypes(current.HowOtherHighRiseBuildingAreConnected), "Connections to other high-rise residential buildings", "Connections to other high-rise residential buildings", groupName + "how-high-rise-buildings-are-connected", sectionName, index));
        changes.push(this.getFieldChange(original.OtherBuildingConnections, current.OtherBuildingConnections, "Connected to other buildings?", "Connected to other buildings?", groupName + "other-building-connection", sectionName, index));
        changes.push(this.getFieldChange(this.getConnectionTypes(original.HowOtherBuildingAreConnected), this.getConnectionTypes(current.HowOtherBuildingAreConnected), "Connections to other buildings", "Connections to other buildings", groupName + "how-buildings-are-connected", sectionName, index));
        
        return changes;
    }

    private connectionTypes: Record<string, string> = {
        "bridge-walkway": "Bridge or walkway between sections",
        "car-park": "Car park below ground",
        "ground-floor": "Ground floor with everyday use",
        "ground-floor-limited": "Ground floor with limited access",
        "levels-below-ground-residential-unit": "Levels below ground with a residential unit",
        "levels-below-ground-no-residential-unit": "Levels below ground without a residential unit",
        "shared-wall-emergency-door": "Shared wall with emergency door",
        "shared-wall-everyday-door": "Shared wall with everyday use door",
        "shared-wall-no-door": "Shared wall with no door",
        "other": "Other"
    }

    getConnectionTypes(values?: string[]): string[] {
        return values?.map(x => this.connectionTypes[x]) ?? [];
    }
}