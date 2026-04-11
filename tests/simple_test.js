export const tests = [];

export function describe(name, fn) {
    tests.push({ type: 'suite', name, fn });
}

export function it(name, fn) {
    tests.push({ type: 'test', name, fn });
}

export function expect(actual) {
    return {
        toBe(expected) {
            if (actual !== expected) {
                throw new Error(`Expected ${expected}, but got ${actual}`);
            }
        },
        toBeTruthy() {
            if (!actual) {
                throw new Error(`Expected truthy, but got ${actual}`);
            }
        },
        toBeGreaterThan(expected) {
            if (actual <= expected) {
                throw new Error(`Expected > ${expected}, but got ${actual}`);
            }
        }
    };
}

export async function runTests() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    let currentSuite = null;
    let suiteDiv = null;

    for (const item of tests) {
        if (item.type === 'suite') {
            currentSuite = item.name;
            suiteDiv = document.createElement('div');
            suiteDiv.className = 'suite';
            suiteDiv.innerHTML = `<h2>${currentSuite}</h2>`;
            resultsDiv.appendChild(suiteDiv);

            // Execute suite function to register children tests
            // Note: This simple runner assumes immediate synchronous registration or needs nesting structure.
            // For simplicity, we just run the function.
            try {
                item.fn();
            } catch (e) {
                suiteDiv.innerHTML += `<div class="fail">Suite Error: ${e.message}</div>`;
            }
        } else if (item.type === 'test') {
            const testDiv = document.createElement('div');
            try {
                await item.fn();
                testDiv.className = 'pass';
                testDiv.textContent = `✔ ${item.name}`;
            } catch (error) {
                testDiv.className = 'fail';
                testDiv.textContent = `✘ ${item.name}: ${error.message}`;
            }
            if (suiteDiv) {
                suiteDiv.appendChild(testDiv);
            } else {
                resultsDiv.appendChild(testDiv);
            }
        }
    }

    if (tests.length === 0) {
        resultsDiv.textContent = "No tests found.";
    }
}

// Global expose for convenience if needed, but module import is better
window.describe = describe;
window.it = it;
window.expect = expect;
