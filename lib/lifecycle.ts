export enum ProgramPhase {
    PROBLEM_SELECTION = 'problem_selection',
    ASSIGNMENT = 'assignment',
    EVALUATION = 'evaluation',
    RESULTS = 'results'
}

// System Time Configuration (Fixed Schedule)
// Phase 1: Registration/Problem Selection (Until Mar 31)
// Phase 2: Assignment Phase (April)
// Phase 3: Evaluation Phase (May)
// Phase 4: Results (June onwards)

// NOTE: Using strict ISO dates to prevent timezone drift, but effectively this is system local.
// Considering the user is in IST (+05:30), we'll define boundaries in local time terms or precise ISO.
// To keep it simple and deterministic per server clock:
const PHASE_BOUNDARIES = {
    PROBLEM_SELECTION_END: new Date('2026-03-31T23:59:59'),
    ASSIGNMENT_END: new Date('2026-04-30T23:59:59'),
    EVALUATION_END: new Date('2026-05-31T23:59:59')
};

export function getProgramPhase(now: Date = new Date()): ProgramPhase {
    // Check against boundaries sequentially
    if (now <= PHASE_BOUNDARIES.PROBLEM_SELECTION_END) {
        return ProgramPhase.PROBLEM_SELECTION;
    }
    if (now <= PHASE_BOUNDARIES.ASSIGNMENT_END) {
        return ProgramPhase.ASSIGNMENT;
    }
    if (now <= PHASE_BOUNDARIES.EVALUATION_END) {
        return ProgramPhase.EVALUATION;
    }
    return ProgramPhase.RESULTS;
}

export interface TimelineItem {
    month: string;
    activity: string;
    status: 'Locked' | 'Active' | 'Completed';
    phaseKey: ProgramPhase;
}

export function getTimelineStatus(now: Date = new Date()): TimelineItem[] {
    const currentPhase = getProgramPhase(now);

    // Define the sequence with associated phases
    const items: Array<{ month: string, activity: string, phaseKey: ProgramPhase }> = [
        { month: 'March', activity: 'Problem Selection', phaseKey: ProgramPhase.PROBLEM_SELECTION },
        { month: 'April', activity: 'Assignment Unlock', phaseKey: ProgramPhase.ASSIGNMENT },
        { month: 'May', activity: 'Evaluation Phase', phaseKey: ProgramPhase.EVALUATION },
        { month: 'June', activity: 'Results & Offers', phaseKey: ProgramPhase.RESULTS }
    ];

    return items.map(item => {
        let status: 'Locked' | 'Active' | 'Completed' = 'Locked';

        // Determine status based on phase order
        // We need an order map to compare phases easily
        const phaseOrder = [
            ProgramPhase.PROBLEM_SELECTION,
            ProgramPhase.ASSIGNMENT,
            ProgramPhase.EVALUATION,
            ProgramPhase.RESULTS
        ];

        const currentIndex = phaseOrder.indexOf(currentPhase);
        const itemIndex = phaseOrder.indexOf(item.phaseKey);

        if (currentIndex > itemIndex) {
            status = 'Completed';
        } else if (currentIndex === itemIndex) {
            status = 'Active';
        } else {
            status = 'Locked';
        }

        return {
            month: item.month,
            activity: item.activity,
            status: status,
            phaseKey: item.phaseKey
        };
    });
}
